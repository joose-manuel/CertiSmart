import { Injectable } from '@angular/core';

import { PasoActaVista } from '../Interface/actas-stepper.interface';
import { PASOS_ACTAS } from '../const/actas-stepper.constants';

/**
 * Resuelve el estado visual de cada paso: el actual, los ya recorridos y los
 * que todavía no se pueden abrir porque falta consolidar la nómina.
 */
@Injectable({ providedIn: 'root' })
export class ActasStepperService {
  estado(pasoActual: number, pasoMaximo: number): PasoActaVista[] {
    return PASOS_ACTAS.map((paso) => ({
      ...paso,
      activo: paso.id === pasoActual,
      completado: paso.id < pasoActual,
      habilitado: paso.id <= pasoMaximo || paso.id === pasoActual,
    }));
  }
}
