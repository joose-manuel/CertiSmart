import { Injectable } from '@angular/core';

import { ActaDocumento } from '../../../core/models/acta.model';
import {
  Estudiante,
  nombreUniversidad,
} from '../../../core/models/estudiante.model';
import { OpcionEstudiante } from '../Interface/step-template.interface';

@Injectable()
export class StepTemplateService {
  opcionesEstudiantes(estudiantes: Estudiante[]): OpcionEstudiante[] {
    return estudiantes.map((estudiante, indice) => ({
      label: `${indice + 1}. ${estudiante.nombreCompleto} — ${nombreUniversidad(
        estudiante.universidad,
      )}`,
      value: indice,
    }));
  }

  anterior(indice: number): number {
    return indice > 0 ? indice - 1 : 0;
  }

  siguiente(indice: number, total: number): number {
    return indice < total - 1 ? indice + 1 : indice;
  }

  /* ---------------- Lectura por voz (Web Speech API) ---------------- */

  /** La síntesis de voz no existe en todos los navegadores. */
  soportaVoz(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /** Texto en español que se lee en voz alta para revisar la constancia. */
  textoConstancia(acta: ActaDocumento): string {
    const estudiante = acta.graduando;
    const asignaturas = estudiante.asignaturas
      .map((asignatura) =>
        asignatura.nota === null
          ? `${asignatura.nombre}, sin nota registrada`
          : `${asignatura.nombre}, con nota ${asignatura.nota}`,
      )
      .join('; ');

    return [
      `${acta.titulo}.`,
      `Folio ${acta.folio}.`,
      `Se certifica que ${estudiante.nombreCompleto}, identificado con documento ${estudiante.documento},`,
      `cursó y aprobó las siguientes asignaturas en la ${nombreUniversidad(
        estudiante.universidad,
      )}: ${asignaturas || 'sin asignaturas registradas'}.`,
      `Expedida por la ${acta.institucion.nombre}, ${acta.institucion.dependencia}.`,
      `${acta.textoFecha}.`,
      `${acta.director.nombre}, ${acta.director.cargo}.`,
      `Verifique la autenticidad de esta constancia en ${acta.urlVerificacion}.`,
    ].join(' ');
  }

  /** Inicia la lectura; devuelve `false` si el navegador no la soporta. */
  leer(texto: string, alTerminar: () => void): boolean {
    if (!this.soportaVoz()) {
      return false;
    }

    window.speechSynthesis.cancel();

    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-CO';
    mensaje.rate = 1;
    mensaje.pitch = 1;
    mensaje.onend = () => alTerminar();
    mensaje.onerror = () => alTerminar();

    window.speechSynthesis.speak(mensaje);
    return true;
  }

  detener(): void {
    if (this.soportaVoz()) {
      window.speechSynthesis.cancel();
    }
  }
}
