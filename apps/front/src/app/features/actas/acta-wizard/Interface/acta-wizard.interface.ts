import { ResumenValidacion } from '../../../../core/models/estudiante.model';

export interface GuardaWizard {
  hayDatos: boolean;
  resumen: ResumenValidacion;
}

export interface EventoSeleccion {
  id: number;
  valor: boolean;
}
