import { Injectable } from '@angular/core';
import { ERROR_LABELS } from '../../../../../core/constants/actas.constants';
import {
  CodigoError,
  Estudiante,
  nombreUniversidad,
} from '../../../../../core/models/estudiante.model';

@Injectable()
export class StudentsTableService {
  todosSeleccionados(estudiantes: Estudiante[]): boolean {
    return estudiantes.length > 0 && estudiantes.every((e) => e.seleccionado);
  }

  etiquetaError(codigo: CodigoError): string {
    return ERROR_LABELS[codigo];
  }

  textoErrores(errores: CodigoError[]): string {
    return errores.map((codigo) => ERROR_LABELS[codigo]).join(' · ');
  }

  universidadTexto(estudiante: Estudiante): string {
    return nombreUniversidad(estudiante.universidad) || '—';
  }

  notaTexto(nota: number | null): string {
    return nota === null || nota === undefined || Number.isNaN(nota)
      ? '—'
      : nota.toFixed(1);
  }

  /** «4.6 · 4.6 · —» con el que se resume la fila en la tabla. */
  resumenNotas(estudiante: Estudiante): string {
    if (!estudiante.asignaturas.length) {
      return 'Sin asignaturas';
    }
    return estudiante.asignaturas
      .map((asignatura) => this.notaTexto(asignatura.nota))
      .join(' · ');
  }

  /** Detalle completo para el tooltip de la celda de notas. */
  tituloAsignaturas(estudiante: Estudiante): string {
    return estudiante.asignaturas
      .map(
        (asignatura) =>
          `${asignatura.codigo} ${asignatura.nombre} (${this.notaTexto(
            asignatura.nota,
          )})`,
      )
      .join('\n');
  }

  esNotaInvalida(estudiante: Estudiante): boolean {
    return (
      estudiante.errores.includes('NOTA_NO_NUMERICA') ||
      estudiante.errores.includes('NOTA_FUERA_RANGO')
    );
  }
}
