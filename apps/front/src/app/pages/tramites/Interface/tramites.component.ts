import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  ETIQUETA_NUEVO,
  MENSAJE_DEMO,
  MENSAJE_MOVIDO,
  MENSAJE_NUEVO,
  SIN_TARJETAS,
  SUBTITULO_TRAMITES,
  TITULO_TRAMITES,
} from '../const/tramites.constants';
import { Tramite } from './tramites.interface';
import { TramitesService } from '../Services/tramites.service';

@Component({
  selector: 'app-tramites',
  templateUrl: '../tramites.component.html',
  styleUrls: ['../tramites.component.css'],
})
export class TramitesComponent {
  readonly titulo = TITULO_TRAMITES;
  readonly subtitulo = SUBTITULO_TRAMITES;
  readonly etiquetaNuevo = ETIQUETA_NUEVO;
  readonly avisoDemo = MENSAJE_DEMO;
  readonly sinTarjetas = SIN_TARJETAS;

  readonly columnas = this.tramitesService.columnas();
  tramites: Tramite[] = this.tramitesService.tramites();

  arrastrando: string | null = null;
  columnaActiva: string | null = null;

  constructor(
    private readonly tramitesService: TramitesService,
    private readonly messageService: MessageService,
  ) {}

  get resumen(): string {
    return this.tramitesService.resumen(this.tramites);
  }

  tarjetas(columnaId: string): Tramite[] {
    return this.tramitesService.porColumna(this.tramites, columnaId);
  }

  prioridad(prioridad: Tramite['prioridad']): string {
    return this.tramitesService.prioridad(prioridad);
  }

  onDragStart(evento: DragEvent, tramite: Tramite): void {
    this.arrastrando = tramite.id;
    evento.dataTransfer?.setData('text/plain', tramite.id);

    if (evento.dataTransfer) {
      evento.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(): void {
    this.arrastrando = null;
    this.columnaActiva = null;
  }

  onDragOver(evento: DragEvent, columnaId: string): void {
    evento.preventDefault();
    this.columnaActiva = columnaId;

    if (evento.dataTransfer) {
      evento.dataTransfer.dropEffect = 'move';
    }
  }

  onDragLeave(columnaId: string): void {
    if (this.columnaActiva === columnaId) {
      this.columnaActiva = null;
    }
  }

  onDrop(evento: DragEvent, columnaId: string): void {
    evento.preventDefault();

    const id = evento.dataTransfer?.getData('text/plain') || this.arrastrando;
    const tramite = this.tramites.find((item) => item.id === id);

    this.onDragEnd();

    if (!tramite || tramite.columnaId === columnaId) {
      return;
    }

    this.tramites = this.tramitesService.mover(this.tramites, tramite.id, columnaId);
    this.messageService.add({
      severity: 'success',
      summary: `Trámite ${tramite.radicado}`,
      detail: MENSAJE_MOVIDO,
      life: 3500,
    });
  }

  nuevoTramite(): void {
    this.messageService.add({
      severity: 'info',
      summary: this.titulo,
      detail: MENSAJE_NUEVO,
      life: 5000,
    });
  }
}
