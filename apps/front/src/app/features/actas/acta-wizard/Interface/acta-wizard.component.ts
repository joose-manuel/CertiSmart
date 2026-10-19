import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';

import { BackendReadyService } from '../../../../core/services/backend-ready.service';
import { ActasStoreService } from '../../../../core/services/actas-store.service';
import { PlantillaService } from '../../../../core/services/plantilla.service';
import { mensajeHttpError } from '../../../../core/utils/descarga.util';
import {
  AUDITORIA_ACCION,
  AUDITORIA_CHIP,
  AUDITORIA_DETALLE,
  AUDITORIA_TITULO,
  ETIQUETA_PLANTILLA,
  ETIQUETA_VALIDAR,
  MENSAJE_SIN_NOMINA,
  PASO_CARGA,
  PASO_EXPORTACION,
  PASO_PLANTILLA,
  PASO_VALIDACION,
  SUBTITULO_MODULO,
  TITULO_AVISO_PLANTILLA,
  TITULO_AVISO_VALIDAR,
  TITULO_MODULO,
} from '../const/acta-wizard.constants';
import { ActaWizardService } from '../Services/acta-wizard.service';

@Component({
  selector: 'app-acta-wizard',
  templateUrl: '../acta-wizard.component.html',
  styleUrls: ['../acta-wizard.component.css'],
})
export class ActaWizardComponent implements OnInit {
  @Input() activeStep = PASO_CARGA;
  @Output() stepChange = new EventEmitter<number>();

  readonly pasoCarga = PASO_CARGA;
  readonly pasoValidacion = PASO_VALIDACION;
  readonly pasoPlantilla = PASO_PLANTILLA;
  readonly pasoExportacion = PASO_EXPORTACION;

  readonly tituloModulo = TITULO_MODULO;
  readonly subtituloModulo = SUBTITULO_MODULO;
  readonly etiquetaValidar = ETIQUETA_VALIDAR;
  readonly etiquetaPlantilla = ETIQUETA_PLANTILLA;
  readonly auditoriaTitulo = AUDITORIA_TITULO;
  readonly auditoriaChip = AUDITORIA_CHIP;
  readonly auditoriaDetalle = AUDITORIA_DETALLE;
  readonly auditoriaAccion = AUDITORIA_ACCION;

  auditoriaVisible = false;
  descargandoPlantilla = false;

  constructor(
    private readonly store: ActasStoreService,
    private readonly wizard: ActaWizardService,
    private readonly messageService: MessageService,
    private readonly plantilla: PlantillaService,
    readonly backend: BackendReadyService,
  ) {}

  ngOnInit(): void {
    this.backend.waitForBackend();

    /* Si el usuario vuelve al módulo con una nómina ya cargada, retoma la
       revisión en lugar de mostrarle otra vez la pantalla de carga. */
    if (this.store.hayDatos) {
      this.activeStep = PASO_VALIDACION;
      this.auditoriaVisible = true;
    }
  }

  get hayDatos(): boolean {
    return this.store.hayDatos;
  }

  get pasoMaximo(): number {
    return this.wizard.pasoMaximo(this.store.hayDatos);
  }

  get estadisticas() {
    return this.wizard.auditoria(
      this.store.resumen,
      this.store.seleccionadosCount,
    );
  }

  onCargaCompletada(): void {
    this.auditoriaVisible = true;
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
    this.auditoriaVisible = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Nuevo lote',
      detail: 'Listo para cargar una nueva nómina de estudiantes.',
    });
    this.irA(PASO_CARGA);
  }

  onReintentarBackend(): void {
    this.backend.reset();
  }

  /** Muestra la auditoría calculada y lleva al paso donde se resuelven las observaciones. */
  validarRegistros(): void {
    if (!this.hayDatos) {
      this.messageService.add({
        severity: 'warn',
        summary: TITULO_AVISO_VALIDAR,
        detail: MENSAJE_SIN_NOMINA,
        life: 5000,
      });
      return;
    }

    this.auditoriaVisible = true;
    this.irA(PASO_VALIDACION);
  }

  async descargarPlantilla(): Promise<void> {
    if (this.descargandoPlantilla) {
      return;
    }

    this.descargandoPlantilla = true;
    try {
      await this.plantilla.descargar();
      this.messageService.add({
        severity: 'success',
        summary: TITULO_AVISO_PLANTILLA,
        detail: 'Descarga de la plantilla de análisis de movilidad completada.',
        life: 4000,
      });
    } catch (error) {
      const mensaje = await mensajeHttpError(
        error,
        'No se pudo descargar la plantilla.',
      );
      this.messageService.add({
        severity: 'error',
        summary: TITULO_AVISO_PLANTILLA,
        detail: mensaje,
        life: 8000,
      });
    } finally {
      this.descargandoPlantilla = false;
    }
  }

  irA(paso: number): void {
    this.activeStep = paso;
    this.stepChange.emit(paso);
  }
}
