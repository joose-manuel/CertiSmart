import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  Asignatura,
  EdicionEstudiante,
  Estudiante,
} from '../../../../core/models/estudiante.model';
import {
  DIALOGO_AVISO_ERROR,
  DIALOGO_AVISO_OK,
  DIALOGO_SUBTITULO,
  DIALOGO_TITULO,
  NOTA_MAX,
  NOTA_MIN,
} from './student-edit-dialog.constants';
import { StudentEditDialogService } from './student-edit-dialog.service';

@Component({
  selector: 'app-student-edit-dialog',
  templateUrl: './student-edit-dialog.component.html',
  styleUrls: ['./student-edit-dialog.component.css'],
  providers: [StudentEditDialogService],
})
export class StudentEditDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() estudiante: Estudiante | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<EdicionEstudiante>();

  readonly titulo = DIALOGO_TITULO;
  readonly subtitulo = DIALOGO_SUBTITULO;
  readonly avisoError = DIALOGO_AVISO_ERROR;
  readonly avisoOk = DIALOGO_AVISO_OK;
  readonly notaMin = NOTA_MIN;
  readonly notaMax = NOTA_MAX;

  form: EdicionEstudiante = this.formularioVacio();

  constructor(private readonly dialogService: StudentEditDialogService) {}

  ngOnChanges(): void {
    if (this.estudiante) {
      this.form = this.dialogService.construirFormulario(this.estudiante);
    }
  }

  get esError(): boolean {
    return this.estudiante?.estado === 'error';
  }

  get motivo(): string | null {
    return this.dialogService.motivo(this.estudiante);
  }

  cerrar(): void {
    this.visibleChange.emit(false);
  }

  onSubmit(): void {
    this.guardar.emit({ ...this.form });
  }

  private formularioVacio(): EdicionEstudiante {
    const asignaturas: Asignatura[] = [
      { codigo: '', nombre: '', nota: null },
      { codigo: '', nombre: '', nota: null },
      { codigo: '', nombre: '', nota: null },
    ];
    return {
      id: 0,
      universidad: '',
      documento: '',
      nombreCompleto: '',
      asignaturas,
    };
  }
}
