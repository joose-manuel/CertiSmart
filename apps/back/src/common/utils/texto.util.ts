import {
  CIUDAD_EXPEDICION,
  MESES_ES,
} from '../constants/constancia.constants';

const CONECTORES = ['de', 'del', 'la', 'las', 'los', 'y', 'e', 'o', 'u'];

/**
 * Normaliza el nombre de la universidad que trae el Excel para mostrarlo en
 * la constancia: "DEL NORTE" → "del Norte", "SANTIAGO DE CALI" → "Santiago
 * de Cali", "NACIONAL" → "Nacional".
 */
export function nombreUniversidad(universidad: string): string {
  const limpia = (universidad ?? '').trim().replace(/\s+/g, ' ');
  if (!limpia) {
    return '';
  }
  return limpia
    .toLowerCase()
    .split(' ')
    .map((palabra) =>
      CONECTORES.includes(palabra)
        ? palabra
        : palabra.charAt(0).toUpperCase() + palabra.slice(1),
    )
    .join(' ');
}

/** «2026-10-15» → «15 de octubre de 2026» (igual que la plantilla Word). */
export function fechaEnTexto(fecha: string): string {
  const [anio, mes, dia] = (fecha ?? '').split('-').map((p) => Number(p));
  if (!anio || !mes || !dia || mes < 1 || mes > 12) {
    return fecha ?? '';
  }
  return `${dia} de ${MESES_ES[mes - 1]} de ${anio}`;
}

export function textoFechaExpedicion(fecha: string): string {
  return `${CIUDAD_EXPEDICION}, ${fechaEnTexto(fecha)}`;
}

/** Nota numérica → «4.6»; nota pendiente (null) → «—». */
export function notaTexto(nota: number | null): string {
  return nota === null || nota === undefined || Number.isNaN(nota)
    ? '—'
    : nota.toFixed(1);
}
