import { Injectable, signal } from '@angular/core';

export type TemaSga = 'light' | 'dark';

const CLAVE_TEMA = 'certismart-theme';

/**
 * Tema visual del sistema (claro/oscuro). Centraliza el estado para que el
 * topbar del shell, el header del wizard y cualquier módulo compartan el
 * mismo comportamiento y la misma clave de persistencia.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly tema = signal<TemaSga>('light');

  private inicializado = false;

  /** Lee la preferencia guardada y la aplica al documento (idempotente). */
  inicializar(): void {
    if (this.inicializado) {
      return;
    }

    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado === 'dark' || guardado === 'light') {
      this.tema.set(guardado);
    } else {
      const prefiereOscuro = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      this.tema.set(prefiereOscuro ? 'dark' : 'light');
    }

    this.aplicar();
    this.inicializado = true;
  }

  alternar(): void {
    this.tema.set(this.tema() === 'dark' ? 'light' : 'dark');
    localStorage.setItem(CLAVE_TEMA, this.tema());
    this.aplicar();
  }

  get oscuro(): boolean {
    return this.tema() === 'dark';
  }

  private aplicar(): void {
    const oscuro = this.oscuro;
    document.documentElement.dataset['theme'] = oscuro ? 'dark' : 'light';
    document.documentElement.classList.toggle('theme-dark', oscuro);
  }
}
