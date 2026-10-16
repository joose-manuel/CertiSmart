import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ACTA_CONFIG_DEFAULT, ActaConfig, FormatoNombre } from '../common/models/acta.model';
import { Estudiante } from '../common/models/estudiante.model';
import { ActasService, LoteGenerado } from './actas.service';

export interface SolicitudPreview {
  estudiante?: Estudiante;
  config?: Partial<ActaConfig>;
}

export interface SolicitudGenerar {
  estudiantes?: Estudiante[];
  config?: Partial<ActaConfig>;
  formatoNombre?: FormatoNombre;
  nombrePaquete?: string;
}

function normalizarConfig(config?: Partial<ActaConfig>): ActaConfig {
  const folio = Math.trunc(Number(config?.folioInicial));
  const fecha = `${config?.fechaExpedicion ?? ''}`;
  return {
    folioInicial:
      Number.isFinite(folio) && folio >= 1
        ? folio
        : ACTA_CONFIG_DEFAULT.folioInicial,
    fechaExpedicion: /^\d{4}-\d{2}-\d{2}$/.test(fecha)
      ? fecha
      : ACTA_CONFIG_DEFAULT.fechaExpedicion,
    codigoQr: config?.codigoQr === true,
    marcaAgua: config?.marcaAgua === true,
    estampaTiempo: config?.estampaTiempo === true,
  };
}

function normalizarEstudiante(entrada: Estudiante): Estudiante {
  return {
    id: Number(entrada?.id) || 0,
    universidad: `${entrada?.universidad ?? ''}`.trim(),
    documento: `${entrada?.documento ?? ''}`.trim(),
    nombreCompleto: `${entrada?.nombreCompleto ?? ''}`.trim(),
    asignaturas: Array.isArray(entrada?.asignaturas)
      ? entrada.asignaturas
          .map((asignatura) => ({
            codigo: `${asignatura?.codigo ?? ''}`.trim(),
            nombre: `${asignatura?.nombre ?? ''}`.trim(),
            nota:
              asignatura?.nota === null || asignatura?.nota === undefined
                ? null
                : Number(asignatura.nota),
          }))
          .filter(
            (asignatura) =>
              asignatura.codigo ||
              asignatura.nombre ||
              asignatura.nota !== null,
          )
      : [],
    estado: entrada?.estado === 'error' ? 'error' : 'valido',
    errores: Array.isArray(entrada?.errores) ? entrada.errores : [],
  };
}

@Controller('actas')
export class ActasController {
  constructor(private readonly actas: ActasService) {}

  /** Constancia individual en PDF (muestra de plantilla / re-descarga). */
  @Post('preview')
  async preview(
    @Body() body: SolicitudPreview,
    @Res() res: Response,
  ): Promise<void> {
    if (!body?.estudiante) {
      throw new BadRequestException({
        codigo: 'SOLICITUD_INVALIDA',
        message: 'Falta el estudiante en la solicitud.',
      });
    }

    const config = normalizarConfig(body.config);
    const { buffer, nombre } = await this.actas.preview(
      normalizarEstudiante(body.estudiante),
      config,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombre}"`);
    res.setHeader('X-Nombre-Archivo', nombre);
    res.send(buffer);
  }

  /** Lote completo: ZIP con un PDF por estudiante + manifiesto de folios. */
  @Post('generar')
  async generar(
    @Body() body: SolicitudGenerar,
    @Res() res: Response,
  ): Promise<void> {
    const estudiantes = Array.isArray(body?.estudiantes)
      ? body.estudiantes.map(normalizarEstudiante)
      : [];

    const config = normalizarConfig(body?.config);
    const formato: FormatoNombre =
      body?.formatoNombre === 'folio_documento'
        ? 'folio_documento'
        : 'documento_nombre';

    const lote: LoteGenerado = await this.actas.generar(
      estudiantes,
      config,
      formato,
      body?.nombrePaquete,
    );

    res.setHeader('X-Total', String(lote.manifiesto.total));
    res.setHeader('X-Folio-Inicial', lote.manifiesto.folioInicial);
    res.setHeader('X-Folio-Final', lote.manifiesto.folioFinal);
    res.setHeader('X-Hash-Lote', lote.manifiesto.hashLoteSha256);
    res.setHeader('X-Nombre-Archivo', lote.nombreArchivo);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${lote.nombreArchivo}"`,
    );

    if (lote.tipo === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.send(lote.buffer);
      return;
    }

    res.setHeader('Content-Type', 'application/zip');
    if (lote.stream) {
      lote.stream.on('error', (error: Error) => {
        res.destroy(error);
      });
      lote.stream.pipe(res);
      return;
    }
    res.end();
  }
}
