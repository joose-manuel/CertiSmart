import {
  NOTA_MAX,
  NOTA_MIN,
} from '../constants/constancia.constants';

export type EstadoEstudiante = 'valido' | 'error';

export type CodigoError =
  | 'UNIVERSIDAD_FALTANTE'
  | 'DOCUMENTO_FALTANTE'
  | 'NOMBRE_FALTANTE'
  | 'SIN_ASIGNATURAS'
  | 'ASIGNATURA_INCOMPLETA'
  | 'NOTA_NO_NUMERICA'
  | 'NOTA_FUERA_RANGO';

/**
 * Una asignatura (rotación) del estudiante tal como viene del Excel de
 * movilidad: hasta 3 bloques por fila (código, nombre y nota).
 */
export interface Asignatura {
  codigo: string;
  nombre: string;
  /** null = nota pendiente por registrar (se muestra «—»). */
  nota: number | null;
}

export interface Estudiante {
  id: number;
  /** Universidad de origen del estudiante (columna UNIVERSIDAD del Excel). */
  universidad: string;
  /** Documento de identidad — cédula (columna CC del Excel). */
  documento: string;
  nombreCompleto: string;
  asignaturas: Asignatura[];
  estado: EstadoEstudiante;
  errores: CodigoError[];
}

export interface ResumenValidacion {
  total: number;
  validos: number;
  errores: number;
}

/** Valida un estudiante y devuelve el mismo objeto con estado/errores. */
export function validarEstudiante(estudiante: Estudiante): Estudiante {
  const errores: CodigoError[] = [];

  if (!estudiante.universidad || !estudiante.universidad.trim()) {
    errores.push('UNIVERSIDAD_FALTANTE');
  }
  if (!estudiante.documento || !estudiante.documento.trim()) {
    errores.push('DOCUMENTO_FALTANTE');
  }
  if (!estudiante.nombreCompleto || !estudiante.nombreCompleto.trim()) {
    errores.push('NOMBRE_FALTANTE');
  }

  const asignaturas = estudiante.asignaturas ?? [];
  if (asignaturas.length === 0) {
    errores.push('SIN_ASIGNATURAS');
  }

  const incompleta = asignaturas.some(
    (asignatura) => !asignatura.codigo?.trim() || !asignatura.nombre?.trim(),
  );
  if (incompleta) {
    errores.push('ASIGNATURA_INCOMPLETA');
  }

  const noNumerica = asignaturas.some(
    (asignatura) =>
      typeof asignatura.nota === 'number' && Number.isNaN(asignatura.nota),
  );
  if (noNumerica) {
    errores.push('NOTA_NO_NUMERICA');
  }

  const fueraDeRango = asignaturas.some(
    (asignatura) =>
      typeof asignatura.nota === 'number' &&
      !Number.isNaN(asignatura.nota) &&
      (asignatura.nota <= NOTA_MIN || asignatura.nota > NOTA_MAX),
  );
  if (fueraDeRango) {
    errores.push('NOTA_FUERA_RANGO');
  }

  estudiante.errores = errores;
  estudiante.estado = errores.length > 0 ? 'error' : 'valido';
  return estudiante;
}

export function calcularResumen(
  estudiantes: Estudiante[],
): ResumenValidacion {
  const validos = estudiantes.filter((e) => e.estado === 'valido').length;
  return {
    total: estudiantes.length,
    validos,
    errores: estudiantes.length - validos,
  };
}
