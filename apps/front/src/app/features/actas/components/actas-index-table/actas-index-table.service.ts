import { Injectable } from '@angular/core';
import { ActaIndice } from '../../../../core/models/acta.model';
import {
  INDICE_COLUMNAS,
  INDICE_FILAS,
  INDICE_OPCIONES_FILAS,
  INDICE_VACIO,
} from './actas-index-table.constants';
import { ColumnaIndice, ConfigIndice } from './actas-index-table.interface';

@Injectable()
export class ActasIndexTableService {
  columnas(): ColumnaIndice[] {
    return INDICE_COLUMNAS.map((columna) => ({ ...columna }));
  }

  config(): ConfigIndice {
    return {
      filas: INDICE_FILAS,
      opcionesFilas: [...INDICE_OPCIONES_FILAS],
      vacio: INDICE_VACIO,
    };
  }

  claseFila(fila: ActaIndice): string {
    return fila.estado === 'error' ? 'row--observada' : '';
  }
}
