import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  DIAS_SEMANA,
  MENSAJE_DEMO,
  SIN_EVENTOS,
  SUBTITULO_AGENDA,
  TITULO_AGENDA,
  TITULO_PROXIMOS,
} from '../const/agenda.constants';
import { TipoAgenda } from './agenda.interface';
import { AgendaService } from '../Services/agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: '../agenda.component.html',
  styleUrls: ['../agenda.component.css'],
})
export class AgendaComponent implements OnInit, OnDestroy {
  readonly titulo = TITULO_AGENDA;
  readonly subtitulo = SUBTITULO_AGENDA;
  readonly tituloProximos = TITULO_PROXIMOS;
  readonly avisoDemo = MENSAJE_DEMO;
  readonly sinEventos = SIN_EVENTOS;
  readonly diasSemana = DIAS_SEMANA;

  readonly tipos = this.agenda.tipos();
  readonly opciones = this.agenda.opciones();

  readonly hoy = new Date();
  readonly anio = this.hoy.getFullYear();
  readonly mes = this.hoy.getMonth();

  tipo: TipoAgenda = 'academico';

  private suscripcion?: Subscription;

  constructor(
    private readonly agenda: AgendaService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.suscripcion = this.route.paramMap.subscribe((parametros) => {
      this.tipo = this.agenda.tipoDesdeId(parametros.get('tipo'));
    });
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }

  get config() {
    return this.agenda.config(this.tipo);
  }

  get tituloMes(): string {
    return this.agenda.nombreMes(this.anio, this.mes);
  }

  get mesAbrev(): string {
    return this.agenda.mesAbrev(this.anio, this.mes);
  }

  get cuadricula() {
    return this.agenda.cuadricula(this.anio, this.mes, this.tipo, this.hoy);
  }

  get eventos() {
    return this.agenda.eventosDelMes(this.tipo, this.mes);
  }

  cambiarTipo(tipo: TipoAgenda): void {
    if (tipo === this.tipo) {
      return;
    }
    this.router.navigate(['/agenda', tipo]);
  }
}
