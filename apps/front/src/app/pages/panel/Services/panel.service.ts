import { Injectable } from '@angular/core';

import { ResumenValidacion } from '../../../core/models/estudiante.model';
import {
  ActividadPanel,
  FaseFlujo,
  MetricaPanel,
  NominaEnCurso,
} from '../Interface/panel.interface';
import {
  ACTIVIDAD_PANEL,
  FLUJO_PANEL,
  METRICAS_PANEL,
} from '../const/panel.constants';

/**
 * Arma los datos del panel: métricas y actividad de demostración y, cuando
 * existe, la nómina real cargada en el asistente de actas.
 */
@Injectable({ providedIn: 'root' })
export class PanelService {
  metricas(): MetricaPanel[] {
    return METRICAS_PANEL.map((metrica) => ({ ...metrica }));
  }

  actividad(): ActividadPanel[] {
    return ACTIVIDAD_PANEL.map((evento) => ({ ...evento }));
  }

  /** Embudo con el porcentaje calculado sobre el primer tramo. */
  flujo(): FaseFlujo[] {
    const base = FLUJO_PANEL[0]?.valor ?? 0;

    return FLUJO_PANEL.map((fase) => ({
      ...fase,
      porcentaje: this.porcentaje(fase.valor, base),
    }));
  }

  nomina(resumen: ResumenValidacion, seleccionados: number): NominaEnCurso {
    return {
      hayDatos: resumen.total > 0,
      total: resumen.total,
      validos: resumen.validos,
      observaciones: resumen.errores,
      seleccionados,
    };
  }

  private porcentaje(valor: number, total: number): number {
    if (total <= 0) {
      return 0;
    }
    return Math.round((valor / total) * 100);
  }
}
