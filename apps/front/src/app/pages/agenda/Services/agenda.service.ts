import { Injectable } from '@angular/core';

import {
  DiaCalendario,
  EventoAgenda,
  OpcionTipoAgenda,
  TipoAgenda,
  TipoAgendaConfig,
} from '../Interface/agenda.interface';
import { EVENTOS_AGENDA, TIPOS_AGENDA } from '../const/agenda.constants';

const SEMANAS_VISIBLES = 6;

/** Calendario académico: configuración por tipo, rejilla mensual y eventos. */
@Injectable({ providedIn: 'root' })
export class AgendaService {
  tipos(): TipoAgendaConfig[] {
    return TIPOS_AGENDA.map((tipo) => ({ ...tipo }));
  }

  opciones(): OpcionTipoAgenda[] {
    return TIPOS_AGENDA.map((tipo) => ({
      label: tipo.labelCorto,
      value: tipo.id,
    }));
  }

  /** Normaliza el parámetro de ruta: cualquier valor raro cae en «academico». */
  tipoDesdeId(id: string | null | undefined): TipoAgenda {
    const encontrado = TIPOS_AGENDA.find((tipo) => tipo.id === id);
    return encontrado?.id ?? 'academico';
  }

  config(tipo: TipoAgenda): TipoAgendaConfig {
    const encontrado = TIPOS_AGENDA.find((entrada) => entrada.id === tipo);
    return { ...(encontrado ?? TIPOS_AGENDA[0]) };
  }

  eventos(tipo: TipoAgenda): EventoAgenda[] {
    return (EVENTOS_AGENDA[tipo] ?? []).map((evento) => ({ ...evento }));
  }

  /** Eventos del mes ordenados por día y hora. */
  eventosDelMes(tipo: TipoAgenda, mes: number): EventoAgenda[] {
    void mes;
    return this.eventos(tipo).sort((a, b) => a.dia - b.dia);
  }

  nombreMes(anio: number, mes: number): string {
    const texto = new Date(anio, mes, 1).toLocaleDateString('es-CO', {
      month: 'long',
      year: 'numeric',
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  /** Abreviatura del mes para las fichas de evento: «oct». */
  mesAbrev(anio: number, mes: number): string {
    return new Date(anio, mes, 1)
      .toLocaleDateString('es-CO', { month: 'short' })
      .replace('.', '')
      .toLowerCase();
  }

  /** Rejilla de 6 semanas que empieza en lunes. */
  cuadricula(
    anio: number,
    mes: number,
    tipo: TipoAgenda,
    hoy: Date = new Date(),
  ): DiaCalendario[][] {
    const eventos = this.eventos(tipo);
    const primero = new Date(anio, mes, 1);
    const desplazamiento = (primero.getDay() + 6) % 7;
    const cursor = new Date(anio, mes, 1 - desplazamiento);
    const semanas: DiaCalendario[][] = [];

    for (let semana = 0; semana < SEMANAS_VISIBLES; semana += 1) {
      const dias: DiaCalendario[] = [];

      for (let dia = 0; dia < 7; dia += 1) {
        const fecha = new Date(
          cursor.getFullYear(),
          cursor.getMonth(),
          cursor.getDate(),
        );
        const delMes = fecha.getMonth() === mes;

        dias.push({
          fecha,
          dia: fecha.getDate(),
          delMes,
          hoy: this.esHoy(fecha, hoy),
          eventos: delMes
            ? eventos
                .filter((evento) => evento.dia === fecha.getDate())
                .sort((a, b) => a.hora.localeCompare(b.hora))
            : [],
        });

        cursor.setDate(cursor.getDate() + 1);
      }

      semanas.push(dias);
    }

    return semanas;
  }

  private esHoy(fecha: Date, hoy: Date): boolean {
    return (
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate()
    );
  }
}
