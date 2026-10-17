import { Injectable } from '@angular/core';
import { ERROR_LABELS } from '../../../../core/constants/actas.constants';
import {
  Asignatura,
  EdicionEstudiante,
  Estudiante,
} from '../../../../core/models/estudiante.model';
import {
  DOCUMENTO_SUGERIDO,
  NOTA_MAX,
  NOTA_MIN,
  NOTA_SUGERIDA,
} from './student-edit-dialog.constants';

@Injectable()
export class StudentEditDialogService {
  construirFormulario(estudiante: Estudiante): EdicionEstudiante {
    const asignaturas: Asignatura[] = (estudiante.asignaturas ?? [])
      .map((asignatura) => ({
        codigo: asignatura.codigo,
        nombre: asignatura.nombre,
        nota: this.notaSugerida(asignatura.nota),
      }));

    return {
      id: estudiante.id,
      universidad: estudiante.universidad,
      documento: estudiante.documento || DOCUMENTO_SUGERIDO,
      nombreCompleto: estudiante.nombreCompleto,
      asignaturas,
    };
  }

  motivo(estudiante: Estudiante | null): string | null {
    if (!estudiante || estudiante.estado === 'valido') {
      return null;
    }
    return estudiante.errores
      .map((codigo) => ERROR_LABELS[codigo])
      .join(' · ');
  }

  esNotaValida(nota: number | null): boolean {
    return (
      nota !== null &&
      nota !== undefined &&
      !Number.isNaN(nota) &&
      nota > NOTA_MIN &&
      nota <= NOTA_MAX
    );
  }

  /** La nota pendiente (null) se respeta; la inválida se sugiere corregida. */
  private notaSugerida(nota: number | null): number | null {
    if (nota === null || nota === undefined) {
      return null;
    }
    return this.esNotaValida(nota) ? nota : NOTA_SUGERIDA;
  }
}
