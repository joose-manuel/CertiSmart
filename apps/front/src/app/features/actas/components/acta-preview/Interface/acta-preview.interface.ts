import { ActaDocumento } from '../../../../../core/models/acta.model';

export interface LineaVerificacion {
  etiqueta: string;
  valor: string;
}

export interface OpcionesSello {
  codigoQr: boolean;
  marcaAgua: boolean;
  estampaTiempo: boolean;
}

export type VistaActa = ActaDocumento;
