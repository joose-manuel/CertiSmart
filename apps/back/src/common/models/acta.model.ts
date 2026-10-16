import { Estudiante } from './estudiante.model';
import { Autoridad, Institucion } from '../constants/constancia.constants';

export type FormatoNombre = 'documento_nombre' | 'folio_documento';

/** Parámetros de emisión editables en el asistente del front. */
export interface ActaConfig {
  folioInicial: number;
  fechaExpedicion: string;
  codigoQr: boolean;
  marcaAgua: boolean;
  estampaTiempo: boolean;
}

export const ACTA_CONFIG_DEFAULT: ActaConfig = {
  folioInicial: 1,
  fechaExpedicion: '2026-10-15',
  codigoQr: false,
  marcaAgua: false,
  estampaTiempo: false,
};

/**
 * Constancia de notas de movilidad académica lista para renderizar en PDF.
 * Sigue la plantilla oficial en Word de la Facultad de Salud.
 */
export interface ActaDocumento {
  folio: string;
  titulo: string;
  institucion: Institucion;
  graduando: Estudiante;
  ciudad: string;
  /** «Santiago de Cali, 15 de octubre de 2026» */
  textoFecha: string;
  director: Autoridad;
  urlVerificacion: string;
  hash: string;
}

/** Una constancia emitida dentro de un lote ya renderizado. */
export interface ActaGenerada {
  numero: number;
  folio: string;
  documento: string;
  nombreCompleto: string;
  universidad: string;
  archivo: string;
  hash: string;
  buffer: Buffer;
}

/** Entrada del manifiesto.json incluido dentro del paquete ZIP. */
export interface ActaManifiesto {
  numero: number;
  folio: string;
  documento: string;
  nombreCompleto: string;
  universidad: string;
  archivoPdf: string;
  hashSha256: string;
}

export interface Manifiesto {
  generadoEn: string;
  total: number;
  folioInicial: string;
  folioFinal: string;
  hashLoteSha256: string;
  constancias: ActaManifiesto[];
}
