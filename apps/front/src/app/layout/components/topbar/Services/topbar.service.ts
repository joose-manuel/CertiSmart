import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ResultadoBusqueda } from '../Interface/topbar.interface';

/**
 * La búsqueda global del topbar todavía no tiene backend: por ahora informa
 * al usuario que el índice unificado aún no está disponible.
 */
@Injectable({ providedIn: 'root' })
export class TopbarService {
  constructor(private readonly messages: MessageService) {}

  buscarGlobal(termino: string): ResultadoBusqueda {
    const limpio = `${termino ?? ''}`.trim();

    if (!limpio) {
      return {
        termino: '',
        encontrado: false,
        mensaje: 'Escriba un documento, folio o nombre para buscar.',
      };
    }

    const resultado: ResultadoBusqueda = {
      termino: limpio,
      encontrado: false,
      mensaje:
        'La búsqueda global todavía no está conectada. Filtre dentro de cada módulo mientras tanto.',
    };

    this.messages.add({
      severity: 'info',
      summary: `Búsqueda: “${limpio}”`,
      detail: resultado.mensaje,
      life: 4000,
    });

    return resultado;
  }
}
