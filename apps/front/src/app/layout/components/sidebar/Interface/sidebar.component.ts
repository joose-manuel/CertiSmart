import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { SGA_SECCIONES_ABIERTAS } from '../../../const/layout.constants';
import {
  SIDEBAR_ICONO_CHEVRON,
  SIDEBAR_LOGO_TITULO,
  SIDEBAR_NAV_LABEL,
  SIDEBAR_PERFIL_LABEL,
} from '../const/sidebar.constants';
import { SidebarService } from '../Services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: '../sidebar.component.html',
  styleUrls: ['../sidebar.component.css'],
})
export class SidebarComponent {
  readonly marca = this.sidebar.marca;
  readonly usuario = this.sidebar.usuario;

  readonly iconoChevron = SIDEBAR_ICONO_CHEVRON;
  readonly logoTitle = SIDEBAR_LOGO_TITULO;
  readonly navLabel = SIDEBAR_NAV_LABEL;
  readonly perfilLabel = SIDEBAR_PERFIL_LABEL;

  private readonly url = signal(this.router.url);
  private readonly abiertos = signal<Record<string, boolean>>({
    ...SGA_SECCIONES_ABIERTAS,
  });

  readonly entradas = computed(() =>
    this.sidebar.entradas(this.url(), this.abiertos()),
  );

  constructor(
    private readonly sidebar: SidebarService,
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe((evento) => this.url.set((evento as NavigationEnd).urlAfterRedirects));
  }

  alternarSeccion(id: string): void {
    this.abiertos.update((actual) => ({
      ...actual,
      [id]: !(actual[id] === true),
    }));
  }
}
