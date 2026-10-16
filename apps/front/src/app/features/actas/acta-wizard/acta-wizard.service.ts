import { Injectable } from '@angular/core';
import { PASO_INICIAL, TOTAL_PASOS } from './acta-wizard.constants';

@Injectable({ providedIn: 'root' })
export class ActaWizardService {
  siguiente(paso: number): number {
    return Math.min(paso + 1, TOTAL_PASOS - 1);
  }

  anterior(paso: number): number {
    return Math.max(paso - 1, PASO_INICIAL);
  }

  esPrimero(paso: number): boolean {
    return paso <= PASO_INICIAL;
  }

  esUltimo(paso: number): boolean {
    return paso >= TOTAL_PASOS - 1;
  }
}
