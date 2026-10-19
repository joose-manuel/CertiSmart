import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActasStepperService } from '../Services/actas-stepper.service';
import { PASOS_LABEL } from '../const/actas-stepper.constants';

@Component({
  selector: 'app-actas-stepper',
  templateUrl: '../actas-stepper.component.html',
  styleUrls: ['../actas-stepper.component.css'],
})
export class ActasStepperComponent {
  @Input() pasoActual = 0;
  @Input() pasoMaximo = 0;
  @Output() pasoSeleccionado = new EventEmitter<number>();

  readonly label = PASOS_LABEL;

  constructor(private readonly stepper: ActasStepperService) {}

  get pasos() {
    return this.stepper.estado(this.pasoActual, this.pasoMaximo);
  }

  ir(paso: number, habilitado: boolean, activo: boolean): void {
    if (!habilitado || activo) {
      return;
    }
    this.pasoSeleccionado.emit(paso);
  }
}
