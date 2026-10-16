import { Injectable } from '@angular/core';
import {
  CIUDAD_EXPEDICION,
  DIRECTOR_PROGRAMA,
  FOLIO_PREFIJO,
  INSTITUCION,
  MESES_ES,
  TITULO_CONSTANCIA,
} from '../constants/actas.constants';
import { ActaConfig, ActaDocumento } from '../models/acta.model';
import { Estudiante, nombreUniversidad } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class ActaDocumentoService {
  construir(
    graduando: Estudiante,
    config: ActaConfig,
    folio: number,
  ): ActaDocumento {
    const folioTexto = `${FOLIO_PREFIJO}${String(folio).padStart(5, '0')}`;

    return {
      folio: folioTexto,
      titulo: TITULO_CONSTANCIA,
      institucion: INSTITUCION,
      graduando,
      ciudad: CIUDAD_EXPEDICION,
      textoFecha: `${CIUDAD_EXPEDICION}, ${this.fechaEnTexto(
        config.fechaExpedicion,
      )}`,
      director: DIRECTOR_PROGRAMA,
      urlVerificacion: `${INSTITUCION.dominioVerificacion}/${folioTexto}`,
    };
  }

  /** "DEL NORTE" → "del Norte" tal como debe verse en la constancia. */
  universidadTexto(estudiante: Estudiante): string {
    return nombreUniversidad(estudiante.universidad);
  }

  /** "2026-10-15" → "15 de octubre de 2026" (igual que la plantilla Word). */
  private fechaEnTexto(fecha: string): string {
    const [anio, mes, dia] = (fecha ?? '').split('-').map((p) => Number(p));
    if (!anio || !mes || !dia || mes < 1 || mes > 12) {
      return fecha ?? '';
    }
    return `${dia} de ${MESES_ES[mes - 1]} de ${anio}`;
  }


}
