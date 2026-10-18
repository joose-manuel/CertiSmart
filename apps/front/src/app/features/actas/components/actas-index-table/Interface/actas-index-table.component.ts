import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActaIndice } from '../../../../../core/models/acta.model';
import { INDICE_ETIQUETA_PDF } from '../const/actas-index-table.constants';
import { ActasIndexTableService } from '../Services/actas-index-table.service';

@Component({
  selector: 'app-actas-index-table',
  templateUrl: '../actas-index-table.component.html',
  styleUrls: ['../actas-index-table.component.css'],
  providers: [ActasIndexTableService],
})
export class ActasIndexTableComponent {
  @Input() filas: ActaIndice[] = [];
  @Output() descargar = new EventEmitter<ActaIndice>();

  readonly columnas = this.indiceService.columnas();
  readonly config = this.indiceService.config();
  readonly etiquetaPdf = INDICE_ETIQUETA_PDF;

  constructor(private readonly indiceService: ActasIndexTableService) {}

  claseFila(fila: ActaIndice): string {
    return this.indiceService.claseFila(fila);
  }

  onDescargar(fila: ActaIndice): void {
    this.descargar.emit(fila);
  }
}
