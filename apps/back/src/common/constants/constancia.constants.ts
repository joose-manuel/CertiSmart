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
 * Número máximo de bloques de asignatura que se admiten por fila en el
 * Excel «cargue notas» (código · nombre · nota).
 */
export const MAX_BLOQUES_ASIGNATURA = 10;

/**
 * Columnas esperadas del Excel «cargue notas»: datos del estudiante y hasta
 * MAX_BLOQUES_ASIGNATURA bloques de asignatura (código · nombre · nota).
 */
export const COLUMNAS_ESPERADAS: string[] = (() => {
  const columnas: string[] = ['UNIVERSIDAD', 'CC', 'NOMBRE ESTUDIANTE'];
  for (let bloque = 1; bloque <= MAX_BLOQUES_ASIGNATURA; bloque++) {
    columnas.push(
      `CÓDIGO DE ASIGNATURA ${bloque}`,
      `NOMBRE ASIGNATURA ${bloque}`,
      `NOTA ${bloque}`,
    );
  }
  return columnas;
})();

export const MAX_ARCHIVO_MB = 25;
export const MAX_ESTUDIANTES_LOTE = 2000;

/** Rango válido de notas: (0 - 5]. */
export const NOTA_MIN = 0;
export const NOTA_MAX = 5;
