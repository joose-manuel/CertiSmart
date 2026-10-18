import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CodigoError, Estudiante } from '../../../../../core/models/estudiante.model';
import {
  ETIQUETA_VALIDO,
  TABLA_FILAS,
  TABLA_OPCIONES_FILAS,
  TABLA_VACIO,
  TEXTO_FALTA_DOCUMENTO,
} from '../const/students-table.constants';
import { EventoSeleccionFila } from './students-table.interface';
import { StudentsTableService } from '../Services/students-table.service';

@Component({
  selector: 'app-students-table',
  templateUrl: '../students-table.component.html',
  styleUrls: ['../students-table.component.css'],
  providers: [StudentsTableService],
})
export class StudentsTableComponent {
  @Input() estudiantes: Estudiante[] = [];
  @Output() seleccion = new EventEmitter<EventoSeleccionFila>();
  @Output() seleccionTodos = new EventEmitter<boolean>();
  @Output() editar = new EventEmitter<Estudiante>();

  readonly filas = TABLA_FILAS;
  readonly opcionesFilas = TABLA_OPCIONES_FILAS;
  readonly vacio = TABLA_VACIO;
  readonly etiquetaValido = ETIQUETA_VALIDO;
  readonly faltaDocumento = TEXTO_FALTA_DOCUMENTO;

  constructor(private readonly tablaService: StudentsTableService) {}

  get todosSeleccionados(): boolean {
    return this.tablaService.todosSeleccionados(this.estudiantes);
  }

  textoErrores(errores: CodigoError[]): string {
    return this.tablaService.textoErrores(errores);
  }

  universidadTexto(estudiante: Estudiante): string {
    return this.tablaService.universidadTexto(estudiante);
  }

  resumenNotas(estudiante: Estudiante): string {
    return this.tablaService.resumenNotas(estudiante);
  }

  tituloAsignaturas(estudiante: Estudiante): string {
    return this.tablaService.tituloAsignaturas(estudiante);
  }

  esNotaInvalida(estudiante: Estudiante): boolean {
    return this.tablaService.esNotaInvalida(estudiante);
  }

  onSeleccion(valor: boolean, id: number): void {
    this.seleccion.emit({ id, valor });
  }

  onSeleccionTodos(valor: boolean): void {
    this.seleccionTodos.emit(valor);
  }

  onEditar(estudiante: Estudiante): void {
    this.editar.emit(estudiante);
  }
}
