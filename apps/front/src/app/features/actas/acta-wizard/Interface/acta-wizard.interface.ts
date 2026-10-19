import { ResumenValidacion } from '../../../../core/models/estudiante.model';

export interface GuardaWizard {
  hayDatos: boolean;
  resumen: ResumenValidacion;
}

export interface EventoSeleccion {
  id: number;
  valor: boolean;
}

/** Métrica del banner de auditoría de la nómina. */
export interface EstadisticaAuditoria {
  label: string;
  valor: number;
}
