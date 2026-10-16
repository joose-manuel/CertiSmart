import { Estudiante, EstadoEstudiante } from './estudiante.model';

export type ModoExportacion = 'all' | 'valid' | 'selected' | 'range';

export type FormatoNombre = 'documento_nombre' | 'folio_documento';

export interface Autoridad {
  id: string;
  nombre: string;
  cargo: string;
}

export interface Institucion {
  nombre: string;
  dependencia: string;
  dominioVerificacion: string;
}

/** Parámetros de emisión editables en el asistente. */
export interface ActaConfig {
  folioInicial: number;
  fechaExpedicion: string;
  codigoQr: boolean;
  marcaAgua: boolean;
  estampaTiempo: boolean;
}

/**
 * Constancia de notas de movilidad académica lista para vista previa / PDF.
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
}

/** Fila del índice de folios de un lote en proceso de exportación. */
export interface ActaIndice {
  numero: number;
  folio: string;
  documento: string;
  nombreCompleto: string;
  universidad: string;
  archivo: string;
  estado: EstadoEstudiante;
  /** Estudiante asociado, para descarga individual real desde el backend. */
  estudiante: Estudiante;
}
