import { Injectable } from '@angular/core';

import {
  FiltroMensajes,
  MensajeControl,
  OpcionFiltro,
} from '../Interface/correo.interface';
import { FILTROS_CORREO, MENSAJES_DEMO } from '../const/correo.constants';

/** Buzón de la mesa de control: bandeja, filtros y estado de cada mensaje. */
@Injectable({ providedIn: 'root' })
export class CorreoService {
  filtros(): OpcionFiltro[] {
    return FILTROS_CORREO.map((filtro) => ({ ...filtro }));
  }

  mensajes(): MensajeControl[] {
    return MENSAJES_DEMO.map((mensaje) => ({ ...mensaje }));
  }

  /** Aplica el filtro activo manteniendo los no leídos siempre visibles. */
  visibles(mensajes: MensajeControl[], filtro: FiltroMensajes): MensajeControl[] {
    if (filtro === 'pendientes') {
      return mensajes.filter((mensaje) => !mensaje.atendido);
    }
    return mensajes;
  }

  porId(mensajes: MensajeControl[], id: string | null): MensajeControl | null {
    if (!id) {
      return null;
    }
    return mensajes.find((mensaje) => mensaje.id === id) ?? null;
  }

  noLeidos(mensajes: MensajeControl[]): number {
    return mensajes.filter((mensaje) => mensaje.noLeido).length;
  }

  /** Marca un mensaje como leído sin mutar la lista original. */
  leer(mensajes: MensajeControl[], id: string): MensajeControl[] {
    return mensajes.map((mensaje) =>
      mensaje.id === id ? { ...mensaje, noLeido: false } : mensaje,
    );
  }

  atender(mensajes: MensajeControl[], id: string): MensajeControl[] {
    return mensajes.map((mensaje) =>
      mensaje.id === id
        ? { ...mensaje, atendido: true, noLeido: false }
        : mensaje,
    );
  }

  archivar(mensajes: MensajeControl[], id: string): MensajeControl[] {
    return mensajes.filter((mensaje) => mensaje.id !== id);
  }

  iniciales(remitente: string): string {
    const palabras = remitente
      .replace(/[^\p{L}\s]/gu, ' ')
      .split(/\s+/)
      .filter((palabra) => palabra.length > 2);

    return palabras
      .slice(0, 2)
      .map((palabra) => palabra.charAt(0))
      .join('')
      .toUpperCase();
  }

  parrafos(cuerpo: string): string[] {
    return cuerpo
      .split('\n')
      .map((parrafo) => parrafo.trim())
      .filter((parrafo) => parrafo.length > 0);
  }
}
