import { Injectable } from '@angular/core';

import { ResumenValidacion } from '../../../../core/models/estudiante.model';
import { EstadisticaAuditoria } from '../Interface/acta-wizard.interface';
import { PASO_INICIAL, TOTAL_PASOS } from '../const/acta-wizard.constants';

@Injectable({ providedIn: 'root' })
export class ActaWizardService {
  siguiente(paso: number): number {
    return Math.min(paso + 1, TOTAL_PASOS - 1);
  }

  anterior(paso: number): number {
    return Math.max(paso - 1, PASO_INICIAL);
  }

  esPrimero(paso: number): boolean {
    return paso <= PASO_INICIAL;
  }

  esUltimo(paso: number): boolean {
    return paso >= TOTAL_PASOS - 1;
  }

  /** Último paso que se puede abrir: sin nómina solo está disponible la carga. */
  pasoMaximo(tieneDatos: boolean): number {
    return tieneDatos ? TOTAL_PASOS - 1 : PASO_INICIAL;
  }

  /** Métricas del banner de auditoría a partir del resumen real del store. */
  auditoria(
    resumen: ResumenValidacion,
    seleccionados: number,
  ): EstadisticaAuditoria[] {
    return [
      { label: 'Registros totales', valor: resumen.total },
      { label: 'Válidos', valor: resumen.validos },
      { label: 'Con observaciones', valor: resumen.errores },
      { label: 'Seleccionados', valor: seleccionados },
    ];
  }
}
