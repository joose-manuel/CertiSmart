import { Injectable } from '@angular/core';
import { FOLIO_PREFIJO } from '../../core/constants/actas.constants';
import {
  ActaConfig,
  ActaIndice,
  FormatoNombre,
} from '../../core/models/acta.model';
import {
  Estudiante,
  nombreUniversidad,
} from '../../core/models/estudiante.model';
import { ActaDocumentoService } from '../../core/services/acta-documento.service';
import {
  PESO_MEDIO_ACTA_BYTES,
} from './step-export.constants';
import { ResumenLote, SolicitudSeleccion } from './step-export.interface';

const LARGO_MAX_ARCHIVO = 120;

@Injectable()
export class StepExportService {
  constructor(private readonly documentoService: ActaDocumentoService) {}

  /** Resuelve qué estudiantes entran al lote según el alcance elegido. */
  resolverSeleccion(
    lista: Estudiante[],
    solicitud: SolicitudSeleccion,
  ): Estudiante[] {
    let seleccion: Estudiante[];

    switch (solicitud.modo) {
      case 'valid':
        seleccion = lista.filter((e) => e.estado === 'valido');
        break;
      case 'selected':
        seleccion = lista.filter((e) => e.seleccionado);
        break;
      case 'range':
        seleccion = lista.slice(
          Math.max(solicitud.desde - 1, 0),
          Math.max(solicitud.hasta, solicitud.desde - 1),
        );
        break;
      default:
        seleccion = [...lista];
    }

    if (solicitud.modo !== 'valid' && !solicitud.incluirInvalidos) {
      seleccion = seleccion.filter((e) => e.estado === 'valido');
    }

    return seleccion;
  }

  /** Registros que el alcance descarta y por qué (para avisar en pantalla). */
  contarExcluidos(
    lista: Estudiante[],
    solicitud: SolicitudSeleccion,
  ): { invalidos: number; fueraDeAlcance: number } {
    const incluidos = new Set(
      this.resolverSeleccion(lista, solicitud).map((e) => e.id),
    );
    const excluidos = lista.filter((e) => !incluidos.has(e.id));

    return {
      invalidos: excluidos.filter((e) => e.estado === 'error').length,
      fueraDeAlcance: excluidos.filter((e) => e.estado === 'valido').length,
    };
  }

  folioTexto(folio: number): string {
    return `${FOLIO_PREFIJO}${String(folio).padStart(5, '0')}`;
  }

  folioCorto(folio: string): string {
    return folio.replace(FOLIO_PREFIJO, '');
  }

  rangoFolios(
    folioInicial: number,
    total: number,
  ): {
    desde: string;
    hasta: string;
  } {
    const ultimo = folioInicial + Math.max(total - 1, 0);
    return {
      desde: this.folioTexto(folioInicial),
      hasta: this.folioTexto(ultimo),
    };
  }

  /** Índice de folios: una fila por constancia, con hash y nombre de archivo. */
  construirFilas(
    estudiantes: Estudiante[],
    config: ActaConfig,
    formato: FormatoNombre,
    folioInicial: number,
  ): ActaIndice[] {
    return estudiantes.map((estudiante, indice) => {
      const folio = folioInicial + indice;
      const acta = this.documentoService.construir(estudiante, config, folio);

      return {
        numero: indice + 1,
        folio: acta.folio,
        documento: estudiante.documento,
        nombreCompleto: estudiante.nombreCompleto,
        universidad: nombreUniversidad(estudiante.universidad) || '—',
        archivo: this.nombreArchivo(formato, estudiante, folio),
        estudiante,
  
        estado: estudiante.estado,
      };
    });
  }

  /** Nombre del PDF según el formato elegido (sin acentos ni espacios). */
  nombreArchivo(
    formato: FormatoNombre,
    estudiante: Estudiante,
    folio: number,
  ): string {
    const documento = this.limpiar(estudiante.documento.replace(/\./g, ''));
    const nombreCompleto = this.limpiar(estudiante.nombreCompleto);
    const folioTexto = this.limpiar(this.folioTexto(folio));

    switch (formato) {
      case 'folio_documento':
        return this.recortar(`${folioTexto}_${documento}.pdf`);
      default:
        return this.recortar(
          `${[documento, nombreCompleto].filter(Boolean).join('_')}.pdf`,
        );
    }
  }

  nombreZip(base: string, fechaExpedicion: string): string {
    const limpio = this.limpiarSuave(base) || 'constancias';
    return `${this.recortar(limpio, 60)}_${fechaExpedicion}.zip`;
  }

  nombrePaqueteSugerido(): string {
    return this.limpiarSuave('constancias_movilidad');
  }

  pesoEstimado(total: number): number {
    return total * PESO_MEDIO_ACTA_BYTES;
  }

  formatearPeso(bytes: number): string {
    if (bytes <= 0) {
      return '0 KB';
    }
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  }

  hashCorto(hash: string): string {
    return `${hash.slice(0, 12)}…${hash.slice(-8)}`;
  }
  fechaHora(): string {
    const ahora = new Date();
    const fecha = [
      String(ahora.getDate()).padStart(2, '0'),
      String(ahora.getMonth() + 1).padStart(2, '0'),
      ahora.getFullYear(),
    ].join('/');
    const hora = [
      String(ahora.getHours()).padStart(2, '0'),
      String(ahora.getMinutes()).padStart(2, '0'),
    ].join(':');
    return `${fecha} ${hora}`;
  }

  private limpiar(texto: string): string {
    return this.limpiarSuave(texto).toUpperCase();
  }

  /** Igual que limpiar() pero conserva mayúsculas y minúsculas. */
  private limpiarSuave(texto: string): string {
    return (texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9-]+/g, '_')
      .replace(/^[_-]+|[_-]+$/g, '');
  }

  private recortar(texto: string, max = LARGO_MAX_ARCHIVO): string {
    return texto.length > max ? `${texto.slice(0, max)}` : texto;
  }

  private semilla(texto: string): number {
    let hash = 2166136261;
    for (let i = 0; i < texto.length; i++) {
      hash ^= texto.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  private siguiente(estado: number): number {
    let valor = estado;
    valor ^= valor << 13;
    valor >>>= 0;
    valor ^= valor >> 17;
    valor ^= valor << 5;
    return valor >>> 0;
  }
}
