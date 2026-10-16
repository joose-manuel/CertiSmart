import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import {
  MAX_ESTUDIANTES_LOTE,
} from '../common/constants/constancia.constants';
import {
  ActaGenerada,
  ActaManifiesto,
  FormatoNombre,
  Manifiesto,
  ActaConfig,
} from '../common/models/acta.model';
import { Estudiante } from '../common/models/estudiante.model';
import { construirActa } from '../common/utils/acta.util';
import {
  folioTexto,
  nombreArchivoPdf,
  nombreZip,
} from '../common/utils/nombre-archivo.util';
import { nombreUniversidad } from '../common/utils/texto.util';
import { PdfService } from './pdf.service';

export interface LoteGenerado {
  tipo: 'pdf' | 'zip';
  nombreArchivo: string;
  buffer?: Buffer;
  stream?: any;
  manifiesto: Manifiesto;
}

@Injectable()
export class ActasService {
  constructor(private readonly pdf: PdfService) {}

  /** Constancia individual para la vista previa / descarga por registro. */
  async preview(
    estudiante: Estudiante,
    config: ActaConfig,
  ): Promise<{ buffer: Buffer; nombre: string; folio: string }> {
    this.validarEstudiante(estudiante, 1);
    const acta = construirActa(estudiante, config, config.folioInicial);
    const buffer = await this.pdf.generar(acta, config);
    return { buffer, nombre: `Muestra_${acta.folio}.pdf`, folio: acta.folio };
  }

  /**
   * Genera el lote completo: un PDF por estudiante (con hash SHA-256) y, si
   * hay más de un estudiante, un paquete ZIP con el manifiesto de folios.
   */
  async generar(
    estudiantes: Estudiante[],
    config: ActaConfig,
    formatoNombre: FormatoNombre,
    nombrePaquete?: string,
  ): Promise<LoteGenerado> {
    if (estudiantes.length === 0) {
      throw new BadRequestException({
        codigo: 'SIN_ESTUDIANTES',
        message: 'La solicitud no incluye estudiantes para generar.',
      });
    }
    if (estudiantes.length > MAX_ESTUDIANTES_LOTE) {
      throw new BadRequestException({
        codigo: 'LIMITE_EXCEDIDO',
        message: `El lote supera el máximo de ${MAX_ESTUDIANTES_LOTE} constancias. Divídelo en varios lotes.`,
      });
    }

    estudiantes.forEach((estudiante, indice) =>
      this.validarEstudiante(estudiante, indice + 1),
    );

    const actas: ActaGenerada[] = [];
    const usados = new Set<string>();

    for (let indice = 0; indice < estudiantes.length; indice++) {
      const estudiante = estudiantes[indice];
      const folio = config.folioInicial + indice;
      const acta = construirActa(estudiante, config, folio);
      const buffer = await this.pdf.generar(acta, config);

      let archivo = nombreArchivoPdf(formatoNombre, estudiante, folio);
      if (usados.has(archivo)) {
        archivo = `${nombreArchivoPdf('folio_documento', estudiante, folio)}`;
      }
      usados.add(archivo);

      actas.push({
        numero: indice + 1,
        folio: acta.folio,
        documento: estudiante.documento,
        nombreCompleto: estudiante.nombreCompleto,
        universidad: nombreUniversidad(estudiante.universidad) || '—',
        archivo,
        hash: acta.hash,
        buffer,
      });
    }

    const manifiesto = this.manifiesto(actas);

    if (actas.length === 1) {
      const unica = actas[0];
      return {
        tipo: 'pdf',
        nombreArchivo: unica.archivo,
        buffer: unica.buffer,
        manifiesto,
      };
    }

    const nombreArchivo = nombreZip(
      nombrePaquete?.trim() ? nombrePaquete : 'constancias_movilidad',
      config.fechaExpedicion,
    );
    const { ZipArchive } = await import('archiver');
    const stream = new ZipArchive({ zlib: { level: 9 } });
    stream.append(JSON.stringify(manifiesto, null, 2), {
      name: 'manifiesto.json',
    });
    for (const acta of actas) {
      stream.append(acta.buffer, { name: acta.archivo });
    }
    void stream.finalize();

    return { tipo: 'zip', nombreArchivo, stream, manifiesto };
  }

  private manifiesto(actas: ActaGenerada[]): Manifiesto {
    const constancias: ActaManifiesto[] = actas.map((acta) => ({
      numero: acta.numero,
      folio: acta.folio,
      documento: acta.documento,
      nombreCompleto: acta.nombreCompleto,
      universidad: acta.universidad,
      archivoPdf: acta.archivo,
      hashSha256: acta.hash,
    }));

    const hashLoteSha256 = createHash('sha256')
      .update(
        actas
          .map((acta) => `${acta.folio}|${acta.documento}|${acta.hash}`)
          .join('\n'),
        'utf8',
      )
      .digest('hex');

    return {
      generadoEn: new Date().toISOString(),
      total: actas.length,
      folioInicial: actas[0].folio,
      folioFinal: actas[actas.length - 1].folio,
      hashLoteSha256,
      constancias,
    };
  }

  private validarEstudiante(estudiante: Estudiante, indice: number): void {
    if (!estudiante || typeof estudiante !== 'object') {
      throw new BadRequestException({
        codigo: 'ESTUDIANTE_INVALIDO',
        message: `El registro ${indice} no tiene datos válidos.`,
      });
    }
    if (!estudiante.nombreCompleto?.trim()) {
      throw new BadRequestException({
        codigo: 'ESTUDIANTE_SIN_NOMBRE',
        message: `El registro ${indice} no tiene nombre del estudiante; corrígelo o exclúyelo del lote antes de generar.`,
      });
    }
    if (!estudiante.documento?.trim()) {
      throw new BadRequestException({
        codigo: 'ESTUDIANTE_SIN_DOCUMENTO',
        message: `El registro "${estudiante.nombreCompleto}" no tiene documento (C.C.); corrígelo o exclúyelo del lote antes de generar.`,
      });
    }
    if (!Array.isArray(estudiante.asignaturas)) {
      estudiante.asignaturas = [];
    }
  }
}
