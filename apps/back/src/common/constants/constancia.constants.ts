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

export const INSTITUCION: Institucion = {
  nombre: 'Universidad del Valle',
  dependencia: 'Facultad de Salud · Programa Académico de Medicina',
  dominioVerificacion: 'https://salud.univalle.edu.co/constancias',
};

export const TITULO_CONSTANCIA = 'CONSTANCIA DE NOTAS MOVILIDAD ACADÉMICA';

/** Ciudad que encabeza la constancia: «Santiago de Cali, 15 de octubre…» */
export const CIUDAD_EXPEDICION = 'Santiago de Cali';

export const PROGRAMA_ACADEMICO = 'Programa de Medicina';

/** Autoridad firmante de la constancia (plantilla oficial en Word). */
export const DIRECTOR_PROGRAMA: Autoridad = {
  id: 'director-medicina',
  nombre: 'JOSÉ DANIEL OSORIO OROZCO, MD',
  cargo: 'Director Programa Académico de Medicina',
};

export const FOLIO_PREFIJO = 'CM-2026-';

export const MESES_ES: string[] = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/**
 * Columnas esperadas del Excel «cargue notas»: datos del estudiante y hasta
 * 3 bloques de asignatura (código · nombre · nota).
 */
export const COLUMNAS_ESPERADAS: string[] = [
  'UNIVERSIDAD',
  'CC',
  'NOMBRE ESTUDIANTE',
  'CÓDIGO DE ASIGNATURA 1',
  'NOMBRE ASIGNATURA 1',
  'NOTA 1',
  'CÓDIGO DE ASIGNATURA 2',
  'NOMBRE ASIGNATURA 2',
  'NOTA 2',
  'CÓDIGO DE ASIGNATURA 3',
  'NOMBRE ASIGNATURA 3',
  'NOTA 3',
];

export const MAX_ARCHIVO_MB = 25;
export const MAX_ESTUDIANTES_LOTE = 2000;

/** Rango válido de notas: (0 - 5]. */
export const NOTA_MIN = 0;
export const NOTA_MAX = 5;
