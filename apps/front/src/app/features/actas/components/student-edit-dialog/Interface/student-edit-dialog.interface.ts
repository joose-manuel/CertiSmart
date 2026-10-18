import { EdicionEstudiante } from '../../../../../core/models/estudiante.model';

export interface ContextoEdicion {
  edicion: EdicionEstudiante;
  esError: boolean;
  motivo: string | null;
}
