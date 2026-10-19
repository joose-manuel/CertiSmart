import { Injectable } from '@angular/core';

import {
  CasoVerificacion,
  EstadoRequisito,
  OpcionCaso,
  ResumenRequisitos,
} from '../Interface/verificador.interface';
import {
  CASOS_VERIFICACION,
  ETIQUETAS_ESTADO,
  VEREDICTO_APTO,
  VEREDICTO_BLOQUEADO,
  VEREDICTO_PENDIENTE,
} from '../const/verificador.constants';

/**
 * Verificación de requisitos: por ahora trabaja sobre casos de demostración,
 * con la misma forma en que respondería una integración real.
 */
@Injectable({ providedIn: 'root' })
export class VerificadorService {
  casos(): CasoVerificacion[] {
    return CASOS_VERIFICACION.map((caso) => ({
      ...caso,
      requisitos: caso.requisitos.map((requisito) => ({ ...requisito })),
    }));
  }

  opciones(casos: CasoVerificacion[]): OpcionCaso[] {
    return casos.map((caso) => ({
      label: `${caso.nombre} · ${caso.documento}`,
      value: caso.documento,
    }));
  }

  porDocumento(
    casos: CasoVerificacion[],
    documento: string,
  ): CasoVerificacion | null {
    return casos.find((caso) => caso.documento === documento) ?? null;
  }

  resumen(caso: CasoVerificacion | null): ResumenRequisitos {
    const requisitos = caso?.requisitos ?? [];

    return {
      total: requisitos.length,
      ok: requisitos.filter((r) => r.estado === 'ok').length,
      pendiente: requisitos.filter((r) => r.estado === 'pendiente').length,
      bloqueado: requisitos.filter((r) => r.estado === 'bloqueado').length,
    };
  }

  /** Veredicto global del caso a partir de los estados. */
  veredicto(resumen: ResumenRequisitos): string {
    if (resumen.bloqueado > 0) {
      return VEREDICTO_BLOQUEADO;
    }
    if (resumen.pendiente > 0) {
      return VEREDICTO_PENDIENTE;
    }
    return VEREDICTO_APTO;
  }

  tonoVeredicto(resumen: ResumenRequisitos): 'ok' | 'warn' | 'danger' {
    if (resumen.bloqueado > 0) {
      return 'danger';
    }
    if (resumen.pendiente > 0) {
      return 'warn';
    }
    return 'ok';
  }

  etiqueta(estado: EstadoRequisito): string {
    return ETIQUETAS_ESTADO[estado];
  }
}
