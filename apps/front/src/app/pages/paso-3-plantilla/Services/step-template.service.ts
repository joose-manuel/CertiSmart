import { Injectable } from '@angular/core';
import {
  Estudiante,
  nombreUniversidad,
} from '../../../core/models/estudiante.model';
import { OpcionEstudiante } from '../Interface/step-template.interface';

@Injectable()
export class StepTemplateService {
  opcionesEstudiantes(estudiantes: Estudiante[]): OpcionEstudiante[] {
    return estudiantes.map((estudiante, indice) => ({
      label: `${indice + 1}. ${estudiante.nombreCompleto} — ${nombreUniversidad(
        estudiante.universidad,
      )}`,
      value: indice,
    }));
  }

  anterior(indice: number): number {
    return indice > 0 ? indice - 1 : 0;
  }

  siguiente(indice: number, total: number): number {
    return indice < total - 1 ? indice + 1 : indice;
  }
}
