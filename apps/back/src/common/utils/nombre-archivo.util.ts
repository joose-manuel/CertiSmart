import { FOLIO_PREFIJO } from '../constants/constancia.constants';
import { Estudiante } from '../models/estudiante.model';
import { FormatoNombre } from '../models/acta.model';

const LARGO_MAX_ARCHIVO = 120;

/** Folio numérico → «CM-2026-00001». */
export function folioTexto(folio: number): string {
  return `${FOLIO_PREFIJO}${String(folio).padStart(5, '0')}`;
}

export function folioCorto(folio: string): string {
  return folio.replace(FOLIO_PREFIJO, '');
}

/** Igual que limpiar() pero conserva mayúsculas y minúsculas. */
export function limpiarSuave(texto: string): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9-]+/g, '_')
    .replace(/^[_-]+|[_-]+$/g, '');
}

export function limpiar(texto: string): string {
  return limpiarSuave(texto).toUpperCase();
}

function recortar(texto: string, max = LARGO_MAX_ARCHIVO): string {
  return texto.length > max ? texto.slice(0, max) : texto;
}

/** Nombre del PDF según el formato elegido (sin acentos ni espacios). */
export function nombreArchivoPdf(
  formato: FormatoNombre,
  estudiante: Estudiante,
  folio: number,
): string {
  const documento = limpiar(estudiante.documento.replace(/\./g, ''));
  const nombreCompleto = limpiar(estudiante.nombreCompleto);
  const folioLimpio = limpiar(folioTexto(folio));

  switch (formato) {
    case 'folio_documento':
      return recortar(`${folioLimpio}_${documento}.pdf`);
    default:
      return recortar(
        `${[documento, nombreCompleto].filter(Boolean).join('_')}.pdf`,
      );
  }
}

export function nombreZip(base: string, fechaExpedicion: string): string {
  const limpio = limpiarSuave(base) || 'constancias';
  return `${recortar(limpio, 60)}_${fechaExpedicion}.zip`;
}
