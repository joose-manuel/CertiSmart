import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import {
  COLUMNAS_ESPERADAS,
  MAX_ARCHIVO_MB,
  MAX_ESTUDIANTES_LOTE,
} from '../../../core/constants/actas.constants';
import { ActasStoreService } from '../../../core/services/actas-store.service';
import { ActasApiService } from '../../../core/services/actas-api.service';
import { descargarBlob, mensajeHttpError } from '../../../core/utils/descarga.util';
import {
  STEP_UPLOAD_ACEPTADOS,
  STEP_UPLOAD_TEXTO,
} from '../const/step-upload.constants';
import { StepUploadService } from '../Services/step-upload.service';

@Component({
  selector: 'app-step-upload',
  templateUrl: '../step-upload.component.html',
  styleUrls: ['../step-upload.component.css'],
  providers: [StepUploadService],
})
export class StepUploadComponent implements OnDestroy {
  @Output() cargaCompletada = new EventEmitter<void>();

  @ViewChild('inputArchivo') inputArchivo!: ElementRef<HTMLInputElement>;

  arrastrando = false;
  archivo: File | null = null;
  error: string | null = null;
  subiendo = false;

  readonly t = STEP_UPLOAD_TEXTO;
  readonly aceptados = STEP_UPLOAD_ACEPTADOS;
  readonly columnas = COLUMNAS_ESPERADAS;
  readonly maxArchivoMb = MAX_ARCHIVO_MB;
  readonly maxEstudiantes = MAX_ESTUDIANTES_LOTE;

  constructor(
    private readonly uploadService: StepUploadService,
    private readonly messageService: MessageService,
    private readonly store: ActasStoreService,
    private readonly api: ActasApiService,
  ) {}

  get pesoLegible(): string {
    return this.archivo ? this.uploadService.formatearPeso(this.archivo.size) : '';
  }

  get extension(): string {
    return this.archivo ? this.uploadService.extensionDe(this.archivo.name) : '';
  }

  get puedeSubir(): boolean {
    return this.archivo !== null && this.error === null && !this.subiendo;
  }

  abrirSelector(): void {
    if (this.subiendo) {
      return;
    }
    this.inputArchivo.nativeElement.click();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.abrirSelector();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.subiendo) {
      return;
    }
    this.arrastrando = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrando = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrando = false;
    if (this.subiendo) {
      return;
    }
    const archivo = event.dataTransfer?.files?.[0];
    if (archivo) {
      this.seleccionar(archivo);
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo) {
      this.seleccionar(archivo);
    }
    input.value = '';
  }

  quitar(): void {
    this.archivo = null;
    this.error = null;
  }

  async subir(): Promise<void> {
    if (!this.puedeSubir || !this.archivo) {
      return;
    }
    this.subiendo = true;
    try {
      const resultado = await firstValueFrom(this.api.parsear(this.archivo));
      this.store.cargarDesdeServidor(resultado.estudiantes);
      this.messageService.add({
        severity: 'success',
        summary: 'Nómina cargada',
        detail: `${resultado.resumen.total} registros: ${resultado.resumen.validos} válidos y ${resultado.resumen.errores} con observaciones.`,
        life: 5000,
      });
      this.quitar();
      this.cargaCompletada.emit();
    } catch (error) {
      const mensaje = await mensajeHttpError(error, 'No se pudo analizar el archivo.');
      this.messageService.add({
        severity: 'error',
        summary: 'Análisis fallido',
        detail: mensaje,
        life: 8000,
      });
    } finally {
      this.subiendo = false;
    }
  }

  async descargarPlantilla(): Promise<void> {
    try {
      const resp = await firstValueFrom(this.api.descargarPlantilla());
      const nombre =
        resp.headers.get('X-Nombre-Archivo')?.trim() ||
        'Plantilla_Oficial_CertiSmart.xlsx';
      if (resp.body) {
        descargarBlob(resp.body, nombre);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Plantilla oficial',
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
        summary: 'Plantilla',
        detail: mensaje,
        life: 8000,
      });
    }
  }

  ngOnDestroy(): void {}

  private seleccionar(archivo: File): void {
    const resultado = this.uploadService.validar(archivo);
    if (!resultado.valido) {
      this.archivo = null;
      this.error = resultado.motivo ?? 'El archivo no es válido.';
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo no válido',
        detail: resultado.motivo,
      });
      return;
    }
    this.error = null;
    this.archivo = archivo;
  }
}
