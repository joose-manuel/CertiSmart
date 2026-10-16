import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ActaConfig } from '../models/acta.model';
import { Estudiante } from '../models/estudiante.model';

export interface ServidorAsignatura {
  codigo: string;
  nombre: string;
  nota: number | null;
}

export interface ServidorEstudiante {
  id: number;
  universidad: string;
  documento: string;
  nombreCompleto: string;
  asignaturas: ServidorAsignatura[];
  estado: string;
  errores: string[];
}

export interface NominaParseada {
  resumen: { total: number; validos: number; errores: number };
  estudiantes: ServidorEstudiante[];
}

export interface EncabezadosLote {
  total: number;
  folioInicial: string;
  folioFinal: string;
  hashLote: string;
  nombreArchivo: string;
}

@Injectable({ providedIn: 'root' })
export class ActasApiService {
  private readonly base = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /** Plantilla oficial de Excel (xlsx) para descargar. */
  descargarPlantilla(): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.base}/plantilla`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  /** Sube y analiza un Excel de movilidad; devuelve la nómina validada. */
  parsear(archivo: File): Observable<NominaParseada> {
    const form = new FormData();
    form.append('archivo', archivo, archivo.name);
    return this.http.post<NominaParseada>(
      `${this.base}/nominas/parsear`,
      form,
    );
  }

  /** PDF de una única constancia (vista previa/muestra). */
  previewPdf(
    estudiante: Estudiante,
    config: ActaConfig,
  ): Observable<HttpResponse<Blob>> {
    return this.http.post(
      `${this.base}/actas/preview`,
      { estudiante, config },
      { observe: 'response', responseType: 'blob' },
    );
  }

  /** Genera el lote: un estudiante → PDF directo; varios → ZIP. */
  generar(
    estudiantes: Estudiante[],
    config: ActaConfig,
    formatoNombre: 'documento_nombre' | 'folio_documento',
    nombrePaquete?: string,
  ): Observable<HttpResponse<Blob>> {
    return this.http.post(
      `${this.base}/actas/generar`,
      {
        estudiantes: estudiantes.map((est) => ({
          universidad: est.universidad,
          documento: est.documento,
          nombreCompleto: est.nombreCompleto,
          asignaturas: est.asignaturas,
          estado: est.estado,
          errores: est.errores,
        })),
        config,
        formatoNombre,
        nombrePaquete: nombrePaquete || undefined,
      },
      { observe: 'response', responseType: 'blob' },
    );
  }

  /** Lee los encabezados X-* relevantes de una respuesta de backend. */
  leerEncabezados(resp: HttpResponse<Blob>): EncabezadosLote {
    const headers = resp.headers;
    return {
      total: Number(headers.get('X-Total')) || 0,
      folioInicial: headers.get('X-Folio-Inicial') || '',
      folioFinal: headers.get('X-Folio-Final') || '',
      hashLote: headers.get('X-Hash-Lote') || '',
      nombreArchivo: headers.get('X-Nombre-Archivo') || '',
    };
  }
}
