import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { descargarBlob } from '../utils/descarga.util';
import { ActasApiService } from './actas-api.service';

export const PLANTILLA_NOMBRE_DEFECTO = 'Plantilla_Notas_Movilidad.xlsx';

/**
 * Descarga de la plantilla oficial de nómina. Vive en un servicio propio para
 * que el módulo de actas (cabecera) y el paso de carga compartan exactamente
 * el mismo comportamiento.
 */
@Injectable({ providedIn: 'root' })
export class PlantillaService {
  constructor(private readonly api: ActasApiService) {}

  /** Descarga la plantilla y devuelve el nombre del archivo entregado. */
  async descargar(): Promise<string> {
    const respuesta = await firstValueFrom(this.api.descargarPlantilla());
    const nombre =
      respuesta.headers.get('X-Nombre-Archivo')?.trim() ||
      PLANTILLA_NOMBRE_DEFECTO;

    if (respuesta.body) {
      descargarBlob(respuesta.body, nombre);
    }

    return nombre;
  }
}
