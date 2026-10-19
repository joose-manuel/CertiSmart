import { Injectable, signal } from '@angular/core';

import {
  SGA_TITULO_POR_DEFECTO,
  SGA_TITULOS,
} from '../const/layout.constants';

/**
 * Estado compartido del shell: menú móvil y resolución del título del módulo
 * activo a partir de la URL.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly menuMovilAbierto = signal(false);

  alternarMenuMovil(): void {
    this.menuMovilAbierto.update((abierto) => !abierto);
  }

  cerrarMenuMovil(): void {
    this.menuMovilAbierto.set(false);
  }

  /** Título del topbar: gana la ruta más específica que sea prefijo de la url. */
  tituloDe(url: string): string {
    const limpia = url.split('?')[0];
    const coincidencias = SGA_TITULOS.filter(
      (entrada) => limpia === entrada.ruta || limpia.startsWith(`${entrada.ruta}/`),
    ).sort((a, b) => b.ruta.length - a.ruta.length);

    return coincidencias[0]?.titulo ?? SGA_TITULO_POR_DEFECTO;
  }
}
