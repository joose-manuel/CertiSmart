import { Injectable } from '@angular/core';

import {
  ColumnaKanban,
  PrioridadTramite,
  Tramite,
} from '../Interface/tramites.interface';
import {
  COLUMNAS_KANBAN,
  PRIORIDADES,
  TRAMITES_DEMO,
} from '../const/tramites.constants';

/** Tablero de solicitudes: columnas, tarjetas y movimiento entre columnas. */
@Injectable({ providedIn: 'root' })
export class TramitesService {
  columnas(): ColumnaKanban[] {
    return COLUMNAS_KANBAN.map((columna) => ({ ...columna }));
  }

  tramites(): Tramite[] {
    return TRAMITES_DEMO.map((tramite) => ({ ...tramite }));
  }

  porColumna(tramites: Tramite[], columnaId: string): Tramite[] {
    return tramites.filter((tramite) => tramite.columnaId === columnaId);
  }

  /** Devuelve una copia con el trámite reubicado (nunca muta la entrada). */
  mover(tramites: Tramite[], id: string, columnaId: string): Tramite[] {
    return tramites.map((tramite) =>
      tramite.id === id ? { ...tramite, columnaId, diasEnCola: 0 } : tramite,
    );
  }

  prioridad(prioridad: PrioridadTramite): string {
    return PRIORIDADES[prioridad];
  }

  resumen(tramites: Tramite[]): string {
    const activos = tramites.filter((tramite) => tramite.columnaId !== 'entregados');
    return `${tramites.length} trámites · ${activos.length} en gestión`;
  }
}
