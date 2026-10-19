import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PageHeaderService } from '../Services/page-header.service';
import { PAGE_HEADER_ACCIONES_LABEL } from '../const/page-header.constants';

@Component({
  selector: 'app-page-header',
  templateUrl: '../page-header.component.html',
  styleUrls: ['../page-header.component.css'],
})
export class PageHeaderComponent implements OnChanges {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() icono = '';

  readonly accionesLabel = PAGE_HEADER_ACCIONES_LABEL;

  vista = { titulo: '', subtitulo: '', icono: '' };

  constructor(private readonly pageHeader: PageHeaderService) {}

  ngOnChanges(_cambios: SimpleChanges): void {
    this.vista = this.pageHeader.normalizar({
      titulo: this.titulo,
      subtitulo: this.subtitulo,
      icono: this.icono,
    });
  }
}
