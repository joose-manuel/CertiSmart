import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActasStoreService } from '../../../../core/services/actas-store.service';
import {
  PASO_CARGA,
  PASO_EXPORTACION,
  PASO_PLANTILLA,
  PASO_VALIDACION,
} from '../const/acta-wizard.constants';
import { ActaWizardService } from '../Services/acta-wizard.service';

@Component({
  selector: 'app-acta-wizard',
  templateUrl: '../acta-wizard.component.html',
  styleUrls: ['../acta-wizard.component.css'],
})
export class ActaWizardComponent {
  @Input() activeStep = PASO_CARGA;
  @Output() stepChange = new EventEmitter<number>();

  readonly pasoCarga = PASO_CARGA;
  readonly pasoValidacion = PASO_VALIDACION;
  readonly pasoPlantilla = PASO_PLANTILLA;
  readonly pasoExportacion = PASO_EXPORTACION;

  constructor(
    private readonly store: ActasStoreService,
    private readonly wizard: ActaWizardService,
    private readonly messageService: MessageService,
  ) {}

  get hayDatos(): boolean {
    return this.store.hayDatos;
  }

  get resumen() {
    return this.store.resumen;
  }

  onCargaCompletada(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Nómina cargada',
      detail: `${this.store.resumen.total} registros: ${this.store.resumen.validos} válidos y ${this.store.resumen.errores} con observaciones.`,
    });
    this.irA(PASO_VALIDACION);
  }

  onContinuar(): void {
    this.irA(this.wizard.siguiente(this.activeStep));
  }

  onRetroceder(): void {
    this.irA(this.wizard.anterior(this.activeStep));
  }

  onNuevoLote(): void {
    this.store.limpiar();
    this.messageService.add({
      severity: 'info',
      summary: 'Nuevo lote',
      detail: 'Listo para cargar una nueva nómina de estudiantes.',
    });
    this.irA(PASO_CARGA);
  }

  private irA(paso: number): void {
    this.stepChange.emit(paso);
  }
}
