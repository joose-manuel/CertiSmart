import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActasStoreService } from '../../../core/services/actas-store.service';
import {
  EdicionEstudiante,
  Estudiante,
  FiltroTabla,
} from '../../../core/models/estudiante.model';
import {
  ARCHIVO_DEMO,
  ETIQUETA_AUTOFORMATO,
  MAPEO_CAMPOS,
  PLACEHOLDER_BUSQUEDA,
  TEXTO_BANNER_ERROR,
  TEXTO_SIN_ERRORES,
} from '../const/step-validate.constants';
import { OpcionFiltro } from './step-validate.interface';
import { StepValidateService } from '../Services/step-validate.service';

@Component({
  selector: 'app-step-validate',
  templateUrl: '../step-validate.component.html',
  styleUrls: ['../step-validate.component.css'],
  providers: [StepValidateService],
})
export class StepValidateComponent {
  @Output() continuar = new EventEmitter<void>();
  @Output() retroceder = new EventEmitter<void>();

  filtro: FiltroTabla = 'all';
  busqueda = '';
  dialogoVisible = false;
  estudianteEditando: Estudiante | null = null;

  readonly archivo = ARCHIVO_DEMO;
  readonly mapeo = MAPEO_CAMPOS;
  readonly placeholder = PLACEHOLDER_BUSQUEDA;
  readonly etiquetaAutoformato = ETIQUETA_AUTOFORMATO;
  readonly textoBannerError = TEXTO_BANNER_ERROR;
  readonly textoSinErrores = TEXTO_SIN_ERRORES;

  constructor(
    private readonly store: ActasStoreService,
    private readonly validateService: StepValidateService,
    private readonly messageService: MessageService,
  ) {}

  get resumen() {
    return this.store.resumen;
  }

  get seleccionadosCount(): number {
    return this.store.seleccionadosCount;
  }

  get filtrados(): Estudiante[] {
    return this.validateService.filtrar(
      this.store.lista,
      this.filtro,
      this.busqueda,
    );
  }

  get totalMostrados(): number {
    return this.filtrados.length;
  }

  get opcionesFiltro(): OpcionFiltro[] {
    return [
      { label: `Todos (${this.resumen.total})`, value: 'all' },
      { label: `Válidos (${this.resumen.validos})`, value: 'valid' },
      { label: `Con errores (${this.resumen.errores})`, value: 'errors' },
    ];
  }

  onSeleccion(evento: { id: number; valor: boolean }): void {
    this.store.toggleSeleccion(evento.id, evento.valor);
  }

  onSeleccionTodos(valor: boolean): void {
    this.store.toggleSeleccionTodos(valor);
  }

  onEditar(estudiante: Estudiante): void {
    this.estudianteEditando = estudiante;
    this.dialogoVisible = true;
  }

  onGuardar(edicion: EdicionEstudiante): void {
    const estudiante = this.store.guardarEdicion(edicion);
    this.dialogoVisible = false;
    if (estudiante) {
      this.messageService.add({
        severity: 'success',
        summary: 'Registro actualizado',
        detail:
          estudiante.estado === 'valido'
            ? `${estudiante.nombreCompleto} corregido y validado.`
            : `${estudiante.nombreCompleto} sigue con inconsistencias.`,
      });
    }
  }

  onAutoFormato(): void {
    this.store.aplicarAutoFormato();
    this.messageService.add({
      severity: 'success',
      summary: 'Auto-formato aplicado',
      detail:
        'Nombres normalizados a mayúsculas y espacios en blanco removidos.',
    });
  }

  onContinuar(): void {
    if (this.resumen.errores > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Registros pendientes',
        detail: `Hay ${this.resumen.errores} estudiantes con inconsistencias. Puedes continuar, pero se recomienda corregirlos.`,
      });
    }
    this.continuar.emit();
  }

  onRetroceder(): void {
    this.retroceder.emit();
  }
}
