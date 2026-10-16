import { Injectable } from '@angular/core';
import {
  EXTENSIONES_PERMITIDAS,
  MAX_ARCHIVO_MB,
} from '../../core/constants/actas.constants';
import { ResultadoArchivo } from './step-upload.interface';

@Injectable()
export class StepUploadService {
  validar(archivo: File): ResultadoArchivo {
    const nombre = archivo.name;
    const extension = `.${(nombre.split('.').pop() ?? '').toLowerCase()}`;

    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      return {
        valido: false,
        nombre,
        motivo: `Formato no permitido (${extension}). Usa ${EXTENSIONES_PERMITIDAS.join(
          ', ',
        )}.`,
      };
    }

    if (archivo.size > MAX_ARCHIVO_MB * 1024 * 1024) {
      return {
        valido: false,
        nombre,
        motivo: `El archivo supera el tamaño máximo de ${MAX_ARCHIVO_MB} MB.`,
      };
    }

    if (archivo.size === 0) {
      return {
        valido: false,
        nombre,
        motivo: 'El archivo está vacío.',
      };
    }

    return { valido: true, nombre };
  }

  formatearPeso(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  extensionDe(nombre: string): string {
    return (nombre.split('.').pop() ?? '?').toUpperCase();
  }
}
