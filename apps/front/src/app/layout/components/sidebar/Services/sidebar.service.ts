import { Injectable } from '@angular/core';

import { esSeccion, NavItem, NavSeccion } from '../../../Interface/layout.interface';
import { SGA_MARCA, SGA_MENU, SGA_USUARIO } from '../../../const/layout.constants';
import { EntradaMenuVista, HijoMenuVista } from '../Interface/sidebar.interface';

/**
 * Arma el menú lateral a partir de la configuración y la url activa: resuelve
 * el estado activo/desplegado de cada entrada para que la plantilla solo pinte.
 */
@Injectable({ providedIn: 'root' })
export class SidebarService {
  get marca() {
    return { ...SGA_MARCA };
  }

  get usuario() {
    return { ...SGA_USUARIO };
  }

  entradas(
    url: string,
    abiertos: Record<string, boolean>,
  ): EntradaMenuVista[] {
    return SGA_MENU.map((entrada) =>
      esSeccion(entrada)
        ? this.seccion(entrada, url, abiertos)
        : this.enlace(entrada, url),
    );
  }

  private enlace(entrada: NavItem, url: string): EntradaMenuVista {
    return {
      id: entrada.id,
      label: entrada.label,
      icono: entrada.icono,
      esSeccion: false,
      activo: this.activa(url, entrada.ruta),
      abierta: false,
      ruta: entrada.ruta,
      badge: entrada.badge,
      hijos: [],
    };
  }

  private seccion(
    entrada: NavSeccion,
    url: string,
    abiertos: Record<string, boolean>,
  ): EntradaMenuVista {
    const hijos: HijoMenuVista[] = entrada.hijos.map((hijo) => ({
      id: hijo.id,
      label: hijo.label,
      ruta: hijo.ruta ?? '',
      icono: hijo.icono,
      activo: this.activa(url, hijo.ruta),
    }));

    const activo = hijos.some((hijo) => hijo.activo);

    return {
      id: entrada.id,
      label: entrada.label,
      icono: entrada.icono,
      esSeccion: true,
      activo,
      abierta: abiertos[entrada.id] === true || activo,
      hijos,
    };
  }

  /** Una entrada está activa si la url coincide con su ruta o cuelga de ella. */
  private activa(url: string, ruta?: string): boolean {
    if (!ruta) {
      return false;
    }
    const limpia = url.split('?')[0];
    return limpia === ruta || limpia.startsWith(`${ruta}/`);
  }
}
