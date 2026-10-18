import { Component, Input } from '@angular/core';
import { ActaDocumento } from '../../../../../core/models/acta.model';
import { Asignatura } from '../../../../../core/models/estudiante.model';
import { OpcionesSello } from './acta-preview.interface';
import {
  ETIQUETA_CONSTANCIA,
  ETIQUETA_HOJA,
  MARCA_AGUA,
  MEDIDAS_HOJA,
} from '../const/acta-preview.constants';
import { ActaPreviewService } from '../Services/acta-preview.service';

@Component({
  selector: 'app-acta-preview',
  templateUrl: '../acta-preview.component.html',
  styleUrls: ['../acta-preview.component.css'],
  providers: [ActaPreviewService],
})
export class ActaPreviewComponent {
  @Input() acta: ActaDocumento | null = null;
  @Input() sellos: OpcionesSello = {
    codigoQr: false,
    marcaAgua: false,
    estampaTiempo: false,
  };

  readonly etiquetaHoja = ETIQUETA_HOJA;
  readonly medidasHoja = MEDIDAS_HOJA;
  readonly etiquetaConstancia = ETIQUETA_CONSTANCIA;
  readonly marcaAgua = MARCA_AGUA;

  readonly logotipo = 'assets/constancia/logo-univalle.png';
  readonly sello = 'assets/constancia/sello-facultad-salud.png';
  readonly firma = 'assets/constancia/firma-director.png';

  constructor(private readonly previewService: ActaPreviewService) {}

  get universidad(): string {
    return this.acta ? this.previewService.universidadTexto(this.acta) : '';
  }

  get documentoEstudiante(): string {
    return this.acta ? this.previewService.documentoTexto(this.acta) : '';
  }

  get asignaturas(): Asignatura[] {
    return this.acta?.graduando.asignaturas ?? [];
  }

  notaTexto(nota: number | null): string {
    return this.previewService.notaTexto(nota);
  }

  get textoVerificacion(): string {
    return this.acta ? this.previewService.textoVerificacion(this.acta) : '';
  }

  get textoEstampa(): string {
    return this.previewService.textoEstampa();
  }
}
