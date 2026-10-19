export type TonoColumna = 'info' | 'warn' | 'brand' | 'ok';

export type PrioridadTramite = 'alta' | 'media' | 'baja';

/** Columna del tablero de gestión de solicitudes. */
export interface ColumnaKanban {
  id: string;
  label: string;
  descripcion: string;
  tono: TonoColumna;
}

/** Solicitud académica que se mueve por el tablero. */
export interface Tramite {
  id: string;
  radicado: string;
  titulo: string;
  solicitante: string;
  programa: string;
  prioridad: PrioridadTramite;
  columnaId: string;
  diasEnCola: number;
  etiqueta: string;
}
