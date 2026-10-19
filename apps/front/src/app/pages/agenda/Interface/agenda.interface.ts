export type TipoAgenda = 'academico' | 'grados' | 'atencion';

export type TonoEvento = 'brand' | 'ok' | 'warn' | 'info';

/** Configuración de cada calendario del sistema. */
export interface TipoAgendaConfig {
  id: TipoAgenda;
  label: string;
  /** Etiqueta compacta para el selector de calendarios. */
  labelCorto: string;
  icono: string;
  descripcion: string;
}

/** Evento del calendario académico. */
export interface EventoAgenda {
  id: string;
  titulo: string;
  detalle: string;
  hora: string;
  lugar: string;
  tono: TonoEvento;
  /** Día del mes en el que cae el evento (los eventos se repiten cada mes). */
  dia: number;
}

/** Celda del calendario mensual. */
export interface DiaCalendario {
  fecha: Date;
  dia: number;
  delMes: boolean;
  hoy: boolean;
  eventos: EventoAgenda[];
}

/** Opción del selector de calendarios. */
export interface OpcionTipoAgenda {
  label: string;
  value: TipoAgenda;
}
