import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  ETIQUETA_CASO,
  ETIQUETA_VERIFICANDO,
  ETIQUETA_VERIFICAR,
  MENSAJE_DEMO,
  MENSAJE_VERIFICACION_OK,
  SUBTITULO_VERIFICADOR,
  TITULO_CHECKLIST,
  TITULO_VEREDICTO,
  TITULO_VERIFICADOR,
  VEREDICTO_SIN_VERIFICAR,
} from '../const/verificador.constants';
import { CasoVerificacion } from './verificador.interface';
import { VerificadorService } from '../Services/verificador.service';

@Component({
  selector: 'app-verificador',
  templateUrl: '../verificador.component.html',
  styleUrls: ['../verificador.component.css'],
})
export class VerificadorComponent implements OnInit {
  readonly titulo = TITULO_VERIFICADOR;
  readonly subtitulo = SUBTITULO_VERIFICADOR;
  readonly etiquetaCaso = ETIQUETA_CASO;
  readonly etiquetaVerificar = ETIQUETA_VERIFICAR;
  readonly etiquetaVerificando = ETIQUETA_VERIFICANDO;
  readonly tituloChecklist = TITULO_CHECKLIST;
  readonly tituloVeredicto = TITULO_VEREDICTO;
  readonly avisoDemo = MENSAJE_DEMO;

  readonly casos = this.verificador.casos();
  readonly opciones = this.verificador.opciones(this.casos);

  documento = this.opciones[0]?.value ?? '';
  verificando = false;
  verificado = false;

  constructor(
    private readonly verificador: VerificadorService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.verificado = true;
  }

  get caso(): CasoVerificacion | null {
    return this.verificador.porDocumento(this.casos, this.documento);
  }

  get resumen() {
    return this.verificador.resumen(this.caso);
  }

  get etiquetaVeredicto(): string {
    return this.verificado ? this.veredicto : VEREDICTO_SIN_VERIFICAR;
  }

  get veredicto(): string {
    return this.verificador.veredicto(this.resumen);
  }

  get tonoVeredicto(): string {
    return this.verificado
      ? this.verificador.tonoVeredicto(this.resumen)
      : 'neutro';
  }

  etiqueta(estado: 'ok' | 'pendiente' | 'bloqueado'): string {
    return this.verificador.etiqueta(estado);
  }

  onCasoChange(documento: string): void {
    this.documento = documento;
    this.verificado = false;
  }

  /** Simula la consulta a las dependencias con un tiempo de respuesta real. */
  verificar(): void {
    if (this.verificando) {
      return;
    }

    this.verificando = true;
    this.verificado = false;

    setTimeout(() => {
      this.verificando = false;
      this.verificado = true;
      this.messageService.add({
        severity: 'success',
        summary: TITULO_VEREDICTO,
        detail: `${MENSAJE_VERIFICACION_OK} (${this.resumen.ok}/${this.resumen.total})`,
        life: 4500,
      });
    }, 900);
  }
}
