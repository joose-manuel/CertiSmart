import { Component, Input } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { SGA_BUSQUEDA_PLACEHOLDER, SGA_PERIODO } from '../../../const/layout.constants';
import { LayoutService } from '../../../Services/layout.service';
import {
  TOPBAR_ICONO_TEMA_CLARO,
  TOPBAR_ICONO_TEMA_OSCURO,
  TOPBAR_MENU_LABEL,
  TOPBAR_TEMA_CLARO,
  TOPBAR_TEMA_OSCURO,
  TOPBAR_TITULO_DEFECTO,
} from '../const/topbar.constants';
import { TopbarService } from '../Services/topbar.service';

@Component({
  selector: 'app-topbar',
  templateUrl: '../topbar.component.html',
  styleUrls: ['../topbar.component.css'],
})
export class TopbarComponent {
  @Input() titulo = TOPBAR_TITULO_DEFECTO;

  readonly periodo = SGA_PERIODO;
  readonly busquedaPlaceholder = SGA_BUSQUEDA_PLACEHOLDER;
  readonly menuLabel = TOPBAR_MENU_LABEL;
  readonly tituloTemaClaro = TOPBAR_TEMA_CLARO;
  readonly tituloTemaOscuro = TOPBAR_TEMA_OSCURO;

  termino = '';

  constructor(
    private readonly layout: LayoutService,
    private readonly theme: ThemeService,
    private readonly topbar: TopbarService,
  ) {}

  get oscuro(): boolean {
    return this.theme.oscuro;
  }

  get iconoTema(): string {
    return this.oscuro ? TOPBAR_ICONO_TEMA_CLARO : TOPBAR_ICONO_TEMA_OSCURO;
  }

  get tituloTema(): string {
    return this.oscuro ? this.tituloTemaClaro : this.tituloTemaOscuro;
  }

  abrirMenu(): void {
    this.layout.alternarMenuMovil();
  }

  alternarTema(): void {
    this.theme.alternar();
  }

  buscar(): void {
    this.topbar.buscarGlobal(this.termino);
    this.termino = '';
  }
}
