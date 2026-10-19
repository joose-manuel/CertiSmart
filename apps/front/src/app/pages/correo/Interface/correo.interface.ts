export type TonoMensaje = 'brand' | 'warn' | 'info' | 'ok';

/** Mensaje recibido en la mesa de control de la Secretaría Académica. */
export interface MensajeControl {
  id: string;
  remitente: string;
  asunto: string;
  resumen: string;
  cuerpo: string;
  fecha: string;
  hora: string;
  etiqueta: string;
  tono: TonoMensaje;
  noLeido: boolean;
  adjuntos: number;
  atendido: boolean;
}

/** Vista del buzón: bandeja general o solo lo pendiente. */
export type FiltroMensajes = 'todos' | 'pendientes';

export interface OpcionFiltro {
  label: string;
  value: FiltroMensajes;
}
