import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  ETIQUETA_ARCHIVAR,
  ETIQUETA_MARCA_ATENDIDO,
  ETIQUETA_RESPONDER,
  MENSAJE_ARCHIVADO,
  MENSAJE_ATENDIDO,
  MENSAJE_DEMO,
  MENSAJE_RESPUESTA,
  SIN_MENSAJES,
  SIN_SELECCION,
  SUBTITULO_CORREO,
  TITULO_BUZON,
  TITULO_CORREO,
  TITULO_DETALLE,
} from '../const/correo.constants';
import { FiltroMensajes, MensajeControl } from './correo.interface';
import { CorreoService } from '../Services/correo.service';

@Component({
  selector: 'app-correo',
  templateUrl: '../correo.component.html',
  styleUrls: ['../correo.component.css'],
})
export class CorreoComponent {
  readonly titulo = TITULO_CORREO;
  readonly subtitulo = SUBTITULO_CORREO;
  readonly tituloBuzon = TITULO_BUZON;
  readonly tituloDetalle = TITULO_DETALLE;
  readonly sinSeleccion = SIN_SELECCION;
  readonly sinMensajes = SIN_MENSAJES;
  readonly etiquetaAtender = ETIQUETA_MARCA_ATENDIDO;
  readonly etiquetaResponder = ETIQUETA_RESPONDER;
  readonly etiquetaArchivar = ETIQUETA_ARCHIVAR;
  readonly avisoDemo = MENSAJE_DEMO;

  readonly filtros = this.correo.filtros();

  mensajes: MensajeControl[] = this.correo.mensajes();
  filtro: FiltroMensajes = 'todos';
  seleccionadoId: string | null = this.mensajes[0]?.id ?? null;

  constructor(
    private readonly correo: CorreoService,
    private readonly messageService: MessageService,
  ) {
    if (this.seleccionadoId) {
      this.mensajes = this.correo.leer(this.mensajes, this.seleccionadoId);
    }
  }

  get visibles(): MensajeControl[] {
    return this.correo.visibles(this.mensajes, this.filtro);
  }

  get seleccionado(): MensajeControl | null {
    return this.correo.porId(this.mensajes, this.seleccionadoId);
  }

  get noLeidos(): number {
    return this.correo.noLeidos(this.mensajes);
  }

  iniciales(remitente: string): string {
    return this.correo.iniciales(remitente);
  }

  parrafos(cuerpo: string): string[] {
    return this.correo.parrafos(cuerpo);
  }

  seleccionar(mensaje: MensajeControl): void {
    this.seleccionadoId = mensaje.id;
    this.mensajes = this.correo.leer(this.mensajes, mensaje.id);
  }

  cambiarFiltro(filtro: FiltroMensajes): void {
    this.filtro = filtro;

    if (!this.visibles.some((mensaje) => mensaje.id === this.seleccionadoId)) {
      this.seleccionadoId = this.visibles[0]?.id ?? null;
    }
  }

  marcarAtendido(): void {
    const mensaje = this.seleccionado;
    if (!mensaje) {
      return;
    }

    this.mensajes = this.correo.atender(this.mensajes, mensaje.id);
    this.messageService.add({
      severity: 'success',
      summary: mensaje.asunto,
      detail: MENSAJE_ATENDIDO,
      life: 4000,
    });
  }

  responder(): void {
    const mensaje = this.seleccionado;
    if (!mensaje) {
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: `Respuesta a ${mensaje.remitente}`,
      detail: MENSAJE_RESPUESTA,
      life: 5500,
    });
  }

  archivar(): void {
    const mensaje = this.seleccionado;
    if (!mensaje) {
      return;
    }

    const indice = this.visibles.findIndex((item) => item.id === mensaje.id);
    this.mensajes = this.correo.archivar(this.mensajes, mensaje.id);
    this.seleccionadoId = this.visibles[indice]?.id ?? this.visibles[0]?.id ?? null;

    this.messageService.add({
      severity: 'secondary',
      summary: mensaje.asunto,
      detail: MENSAJE_ARCHIVADO,
      life: 4000,
    });
  }
}
