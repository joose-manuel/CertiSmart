export type EstadoRequisito = 'ok' | 'pendiente' | 'bloqueado';

/** Requisito individual evaluado para un aspirante a grado. */
export interface RequisitoVerificacion {
  id: string;
  label: string;
  detalle: string;
  estado: EstadoRequisito;
  icono: string;
}

/** Caso de verificación (estudiante con su lista de requisitos). */
export interface CasoVerificacion {
  documento: string;
  nombre: string;
  programa: string;
  requisitos: RequisitoVerificacion[];
}

/** Opción del selector de casos. */
export interface OpcionCaso {
  label: string;
  value: string;
}

/** Totales por estado de un caso. */
export interface ResumenRequisitos {
  total: number;
  ok: number;
  pendiente: number;
  bloqueado: number;
}
