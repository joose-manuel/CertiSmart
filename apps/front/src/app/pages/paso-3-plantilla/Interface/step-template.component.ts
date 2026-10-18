import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { FOLIO_PREFIJO } from '../../../core/constants/actas.constants';
import { ActaConfig, ActaDocumento } from '../../../core/models/acta.model';
import { Estudiante } from '../../../core/models/estudiante.model';
import { ActaDocumentoService } from '../../../core/services/acta-documento.service';
import { ActasApiService } from '../../../core/services/actas-api.service';
import { ActasStoreService } from '../../../core/services/actas-store.service';
import { mensajeHttpError, descargarBlob } from '../../../core/utils/descarga.util';
import {
  AYUDA_FOLIO,
  ETIQUETA_AJUSTES,
  ETIQUETA_ESTAMPADA,
  ETIQUETA_ESTUDIANTE_DEMO,
  ETIQUETA_FECHA,
  ETIQUETA_FOLIO,
  ETIQUETA_MARCA_AGUA,
  ETIQUETA_QR,
  SUBTITULO_PLANTILLA,
  TEXTO_VISTA_PREVIA,
  TITULO_PLANTILLA,
  TITULO_SELLOS,
} from '../const/step-template.constants';
import { OpcionesSellos } from './step-template.interface';
import { StepTemplateService } from '../Services/step-template.service';

@Component({
  selector: 'app-step-template',
  templateUrl: '../step-template.component.html',
  styleUrls: ['../step-template.component.css'],
  providers: [StepTemplateService],
})
export class StepTemplateComponent {
  @Output() continuar = new EventEmitter<void>();
  @Output() retroceder = new EventEmitter<void>();

  previewIndex = 0;

  readonly folioPrefijo = FOLIO_PREFIJO;

  readonly titulo = TITULO_PLANTILLA;
  readonly subtitulo = SUBTITULO_PLANTILLA;
  readonly etiquetaFolio = ETIQUETA_FOLIO;
  readonly ayudaFolio = AYUDA_FOLIO;
  readonly etiquetaFecha = ETIQUETA_FECHA;
  readonly etiquetaAjustes = ETIQUETA_AJUSTES;
  readonly etiquetaEstudiante = ETIQUETA_ESTUDIANTE_DEMO;
  readonly tituloSellos = TITULO_SELLOS;
  readonly etiquetaQr = ETIQUETA_QR;
  readonly etiquetaMarcaAgua = ETIQUETA_MARCA_AGUA;
  readonly etiquetaEstampada = ETIQUETA_ESTAMPADA;
  readonly textoVistaPrevia = TEXTO_VISTA_PREVIA;

  constructor(
    private readonly store: ActasStoreService,
    private readonly templateService: StepTemplateService,
    private readonly documentoService: ActaDocumentoService,
    private readonly api: ActasApiService,
    private readonly messageService: MessageService,
  ) {}

  get config() {
    return this.store.configuracion;
  }

  get total(): number {
    return this.store.lista.length;
  }

  get opcionesEstudiantes() {
    return this.templateService.opcionesEstudiantes(this.store.lista);
  }

  get estudiantePreview(): Estudiante | null {
    return this.store.lista[this.previewIndex] ?? null;
  }

  get acta(): ActaDocumento | null {
    const estudiante = this.estudiantePreview;
    if (!estudiante) {
      return null;
    }
    return this.documentoService.construir(
      estudiante,
      this.config,
      this.config.folioInicial,
    );
  }

  get sellos(): OpcionesSellos {
    return {
      codigoQr: this.config.codigoQr,
      marcaAgua: this.config.marcaAgua,
      estampaTiempo: this.config.estampaTiempo,
    };
  }

  onEstudianteChange(indice: number): void {
    this.previewIndex = indice;
  }

  anterior(): void {
    this.previewIndex = this.templateService.anterior(this.previewIndex);
  }

  siguiente(): void {
    this.previewIndex = this.templateService.siguiente(
      this.previewIndex,
      this.total,
    );
  }

  async descargarMuestra(): Promise<void> {
    const estudiante = this.estudiantePreview;
    if (!estudiante) {
      return;
    }
    try {
      this.messageService.add({
        severity: 'info',
        summary: 'Generando muestra',
        detail: `Renderizando ${this.acta?.folio ?? 'constancia'}…`,
      });
      const resp = await firstValueFrom(
        this.api.previewPdf(estudiante, this.config),
      );
      const nombre =
        resp.headers.get('X-Nombre-Archivo')?.trim() ||
        `Muestra_${this.acta?.folio ?? 'constancia'}.pdf`;
      if (resp.body) {
        descargarBlob(resp.body, nombre);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Muestra descargada',
        detail: nombre,
        life: 4000,
      });
    } catch (error) {
      const mensaje = await mensajeHttpError(
        error,
        'No se pudo generar la muestra.',
      );
      this.messageService.add({
        severity: 'error',
        summary: 'Muestra',
        detail: mensaje,
        life: 8000,
      });
    }
  }

  onContinuar(): void {
    this.continuar.emit();
  }

  onRetroceder(): void {
    this.retroceder.emit();
  }
}
