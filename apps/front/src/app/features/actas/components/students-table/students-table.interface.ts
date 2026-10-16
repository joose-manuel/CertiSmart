import { CodigoError } from '../../../../core/models/estudiante.model';

export interface EventoSeleccionFila {
  id: number;
  valor: boolean;
}

export type EtiquetaError = Record<CodigoError, string>;
