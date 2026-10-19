import { Injectable } from '@angular/core';

import { CabeceraPagina } from '../Interface/page-header.interface';
import { PAGE_HEADER_ICONO_DEFECTO } from '../const/page-header.constants';

/** Normaliza los textos de la cabecera antes de pintarlos. */
@Injectable({ providedIn: 'root' })
export class PageHeaderService {
  normalizar(cabecera: CabeceraPagina): Required<CabeceraPagina> {
    return {
      titulo: (cabecera.titulo ?? '').trim(),
      subtitulo: (cabecera.subtitulo ?? '').trim(),
      icono: cabecera.icono?.trim() || PAGE_HEADER_ICONO_DEFECTO,
    };
  }
}
