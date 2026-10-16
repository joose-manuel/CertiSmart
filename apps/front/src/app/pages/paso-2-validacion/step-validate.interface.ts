import { FiltroTabla } from '../../core/models/estudiante.model';

export interface CampoMapeo {
  orden: number;
  etiqueta: string;
}

export interface OpcionFiltro {
  label: string;
  value: FiltroTabla;
}
