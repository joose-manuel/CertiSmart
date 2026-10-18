import { FormatoNombre, ModoExportacion } from '../../../core/models/acta.model';

/** Fases del panel de exportación. */
export type FaseExportacion = 'revision' | 'generando' | 'listo';

export interface OpcionModo {
  label: string;
  value: ModoExportacion;
  detalle: string;
}

export interface OpcionFormato {
  label: string;
  value: FormatoNombre;
}

/** Paso del pipeline de generación que se muestra en la barra de progreso. */
export interface PasoGeneracion {
  etiqueta: string;
  porcentaje: number;
}

export interface EstadisticaLote {
  etiqueta: string;
  valor: string;
  detalle: string;
  icono: string;
  tono: 'brand' | 'ok' | 'warn' | 'neutral';
}

/** Etiquetas de las casillas del resumen del lote. */
export interface EtiquetasResumenLote {
  zip: string;
  actas: string;
  folios: string;
  tamano: string;
  hash: string;
  generado: string;
}

/** Resumen del lote una vez generado. */
export interface ResumenLote {
  total: number;
  folioInicial: string;
  folioFinal: string;
  pesoBytes: number;
  pesoLegible: string;
  nombreZip: string;
  hashLote: string;
  hashLoteCorto: string;
  generadoEn: string;
  vigenciaMin: number;
}

export interface SolicitudSeleccion {
  modo: ModoExportacion;
  desde: number;
  hasta: number;
  incluirInvalidos: boolean;
}
