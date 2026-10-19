import { Component } from '@angular/core';

import { ActasStoreService } from '../../../core/services/actas-store.service';
import {
  ETIQUETA_IR_ACTAS,
  ETIQUETA_NUEVA_EMISION,
  MENSAJE_SIN_NOMINA,
  SUBTITULO_FLUJO,
  SUBTITULO_PANEL,
  TITULO_ACTIVIDAD,
  TITULO_FLUJO,
  TITULO_NOMINA,
  TITULO_PANEL,
} from '../const/panel.constants';
import { PanelService } from '../Services/panel.service';
import { TonoDelta } from './panel.interface';

@Component({
  selector: 'app-panel',
  templateUrl: '../panel.component.html',
  styleUrls: ['../panel.component.css'],
})
export class PanelComponent {
  readonly titulo = TITULO_PANEL;
  readonly subtitulo = SUBTITULO_PANEL;
  readonly etiquetaNuevaEmision = ETIQUETA_NUEVA_EMISION;
  readonly tituloFlujo = TITULO_FLUJO;
  readonly subtituloFlujo = SUBTITULO_FLUJO;
  readonly tituloActividad = TITULO_ACTIVIDAD;
  readonly tituloNomina = TITULO_NOMINA;
  readonly etiquetaIrActas = ETIQUETA_IR_ACTAS;
  readonly mensajeSinNomina = MENSAJE_SIN_NOMINA;

  constructor(
    private readonly panel: PanelService,
    private readonly store: ActasStoreService,
  ) {}

  get metricas() {
    return this.panel.metricas();
  }

  get flujo() {
    return this.panel.flujo();
  }

  get actividad() {
    return this.panel.actividad();
  }

  get nomina() {
    return this.panel.nomina(this.store.resumen, this.store.seleccionadosCount);
  }

  /** Icono de la variación mostrada en cada tarjeta de indicador. */
  iconoDelta(tono?: TonoDelta): string {
    switch (tono) {
      case 'up':
        return 'pi-arrow-up-right';
      case 'down':
        return 'pi-arrow-down-right';
      default:
        return 'pi-minus';
    }
  }
}
