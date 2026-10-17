import { Injectable } from '@angular/core';
import { ActaDocumento } from '../../../../../core/models/acta.model';
import { nombreUniversidad } from '../../../../../core/models/estudiante.model';
import {
  ETIQUETA_ESTAMPADA,
  ETIQUETA_VERIFICACION,
} from '../const/acta-preview.constants';

@Injectable()
export class ActaPreviewService {
  universidadTexto(acta: ActaDocumento): string {
    return nombreUniversidad(acta.graduando.universidad);
  }

  /** «1005980100 - BEDOYA NORIEGA ISABELLA» (primera fila de la tabla). */
  documentoTexto(acta: ActaDocumento): string {
    const documento = acta.graduando.documento || '—';
    return `${documento} - ${acta.graduando.nombreCompleto}`;
  }

  notaTexto(nota: number | null): string {
    return nota === null || nota === undefined || Number.isNaN(nota)
      ? '—'
      : nota.toFixed(1);
  }

  textoVerificacion(acta: ActaDocumento): string {
    return `${ETIQUETA_VERIFICACION} ${acta.urlVerificacion}`;
  }

  textoEstampa(): string {
    return ETIQUETA_ESTAMPADA;
  }
}
