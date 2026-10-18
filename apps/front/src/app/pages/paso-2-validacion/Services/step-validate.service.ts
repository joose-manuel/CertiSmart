import { Injectable } from '@angular/core';
import {
  Estudiante,
  FiltroTabla,
} from '../../../core/models/estudiante.model';

@Injectable()
export class StepValidateService {
  filtrar(
    estudiantes: Estudiante[],
    filtro: FiltroTabla,
    busqueda: string,
  ): Estudiante[] {
    const termino = busqueda.trim().toLowerCase();

    return estudiantes.filter((estudiante) => {
      if (filtro === 'valid' && estudiante.estado !== 'valido') {
        return false;
      }
      if (filtro === 'errors' && estudiante.estado !== 'error') {
        return false;
      }
      if (!termino) {
        return true;
      }
      return (
        estudiante.nombreCompleto.toLowerCase().includes(termino) ||
        estudiante.documento.toLowerCase().includes(termino) ||
        estudiante.universidad.toLowerCase().includes(termino) ||
        estudiante.asignaturas.some((asignatura) =>
          asignatura.nombre.toLowerCase().includes(termino),
        )
      );
    });
  }
}
