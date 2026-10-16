import { createHash } from 'node:crypto';
import {
  CIUDAD_EXPEDICION,
  DIRECTOR_PROGRAMA,
  INSTITUCION,
  TITULO_CONSTANCIA,
} from '../constants/constancia.constants';
import { ActaConfig, ActaDocumento } from '../models/acta.model';
import { Estudiante } from '../models/estudiante.model';
import { folioTexto } from './nombre-archivo.util';
import { textoFechaExpedicion } from './texto.util';

/**
 * Hash SHA-256 determinista del contenido de la constancia: depende del folio
 * y de los datos del estudiante, así que puede recalcularse para verificar el
 * documento sin depender del tamaño o la compresión del PDF.
 */
export function hashActa(estudiante: Estudiante, folio: string): string {
  const asignaturas = (estudiante.asignaturas ?? [])
    .map(
      (asignatura) =>
        `${asignatura.codigo}=${asignatura.nombre}=${asignatura.nota ?? ''}`,
    )
    .join('&');

  const semilla = [
    folio,
    estudiante.documento,
    estudiante.nombreCompleto,
    estudiante.universidad,
    asignaturas,
  ].join('|');

  return createHash('sha256').update(semilla, 'utf8').digest('hex');
}

/** Construye la constancia lista para renderizar (folio, fecha, hash…). */
export function construirActa(
  estudiante: Estudiante,
  config: ActaConfig,
  folio: number,
): ActaDocumento {
  const folioStr = folioTexto(folio);

  return {
    folio: folioStr,
    titulo: TITULO_CONSTANCIA,
    institucion: INSTITUCION,
    graduando: estudiante,
    ciudad: CIUDAD_EXPEDICION,
    textoFecha: textoFechaExpedicion(config.fechaExpedicion),
    director: DIRECTOR_PROGRAMA,
    urlVerificacion: `${INSTITUCION.dominioVerificacion}/${folioStr}`,
    hash: hashActa(estudiante, folioStr),
  };
}
