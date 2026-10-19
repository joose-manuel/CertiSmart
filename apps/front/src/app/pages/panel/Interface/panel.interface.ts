export type TonoPanel = 'brand' | 'ok' | 'warn' | 'info';
export type TonoDelta = 'up' | 'down' | 'flat';

/** Tarjeta de indicador del panel. */
export interface MetricaPanel {
  id: string;
  label: string;
  valor: string;
  icono: string;
  tono: TonoPanel;
  delta?: string;
  deltaTono?: TonoDelta;
  pie: string;
}

/** Barra del embudo de estado de solicitudes. */
export interface FaseFlujo {
  id: string;
  label: string;
  valor: number;
  porcentaje: number;
  tono: TonoPanel;
}

/** Evento de la línea de actividad reciente. */
export interface ActividadPanel {
  id: string;
  titulo: string;
  detalle: string;
  hace: string;
  icono: string;
  tono: TonoPanel;
}

/** Nómina cargada en el asistente de actas (dato real del store). */
export interface NominaEnCurso {
  hayDatos: boolean;
  total: number;
  validos: number;
  observaciones: number;
  seleccionados: number;
}
