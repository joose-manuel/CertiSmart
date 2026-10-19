import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  ETIQUETA_ALGORITMO,
  ETIQUETA_EMISOR,
  ETIQUETA_FICHA,
  ETIQUETA_HUELLA,
  ETIQUETA_RENOVAR,
  ETIQUETA_SERIE,
  ETIQUETA_TITULAR,
  ETIQUETA_VIGENCIA,
  ETIQUETA_VER_SELLOS,
  MENSAJE_DEMO,
  MENSAJE_FICHA,
  MENSAJE_RENOVAR,
  SUBTITULO_FIRMA,
  TITULO_CERTIFICADO,
  TITULO_FIRMA,
  TITULO_SELLOS,
} from '../const/firma.constants';
import { FirmaService } from '../Services/firma.service';

@Component({
  selector: 'app-firma',
  templateUrl: '../firma.component.html',
  styleUrls: ['../firma.component.css'],
})
export class FirmaComponent {
  readonly titulo = TITULO_FIRMA;
  readonly subtitulo = SUBTITULO_FIRMA;
  readonly tituloCertificado = TITULO_CERTIFICADO;
  readonly tituloSellos = TITULO_SELLOS;
  readonly etiquetaRenovar = ETIQUETA_RENOVAR;
  readonly etiquetaFicha = ETIQUETA_FICHA;
  readonly etiquetaVerSellos = ETIQUETA_VER_SELLOS;
  readonly etiquetaTitular = ETIQUETA_TITULAR;
  readonly etiquetaEmisor = ETIQUETA_EMISOR;
  readonly etiquetaSerie = ETIQUETA_SERIE;
  readonly etiquetaAlgoritmo = ETIQUETA_ALGORITMO;
  readonly etiquetaVigencia = ETIQUETA_VIGENCIA;
  readonly etiquetaHuella = ETIQUETA_HUELLA;
  readonly avisoDemo = MENSAJE_DEMO;

  readonly certificado = this.firma.certificado();
  readonly sellos = this.firma.sellos();

  constructor(
    private readonly firma: FirmaService,
    private readonly messageService: MessageService,
  ) {}

  get vigencia(): string {
    return this.firma.vigencia(this.certificado);
  }

  get etiquetaEstado(): string {
    return this.firma.etiqueta(this.certificado.estado);
  }

  hashCorto(hash: string): string {
    return this.firma.hashCorto(hash);
  }

  renovar(): void {
    this.messageService.add({
      severity: 'info',
      summary: this.tituloCertificado,
      detail: MENSAJE_RENOVAR,
      life: 6000,
    });
  }

  descargarFicha(): void {
    this.messageService.add({
      severity: 'success',
      summary: this.tituloCertificado,
      detail: MENSAJE_FICHA,
      life: 5000,
    });
  }

  verificarSello(folio: string): void {
    this.messageService.add({
      severity: 'success',
      summary: `Sello verificado · ${folio}`,
      detail: 'La huella coincide con el documento original emitido.',
      life: 4500,
    });
  }

  verHistorial(): void {
    this.messageService.add({
      severity: 'info',
      summary: this.tituloSellos,
      detail: 'El historial completo estará disponible con el módulo de auditoría.',
      life: 5000,
    });
  }
}
