import { Injectable } from '@angular/core';

import {
  CertificadoDigital,
  EstadoCertificado,
  SelloAplicado,
} from '../Interface/firma.interface';
import {
  CERTIFICADO_DEMO,
  DIAS_ALERTA_VENCIMIENTO,
  ESTADOS_CERTIFICADO,
  SELLOS_DEMO,
} from '../const/firma.constants';

/** Firma y sello digital: estado del certificado institucional y sus sellos. */
@Injectable({ providedIn: 'root' })
export class FirmaService {
  certificado(hoy: Date = new Date()): CertificadoDigital {
    const diasRestantes = this.diasRestantes(CERTIFICADO_DEMO.vigenciaHasta, hoy);

    return {
      ...CERTIFICADO_DEMO,
      diasRestantes,
      estado: this.estado(diasRestantes),
    };
  }

  sellos(): SelloAplicado[] {
    return SELLOS_DEMO.map((sello) => ({ ...sello }));
  }

  etiqueta(estado: EstadoCertificado): string {
    return ESTADOS_CERTIFICADO[estado];
  }

  /** Texto de vigencia listo para pintar: «1 de enero de 2026 — 31 de diciembre de 2027». */
  vigencia(certificado: CertificadoDigital): string {
    return `${this.fechaEnTexto(certificado.vigenciaDesde)} — ${this.fechaEnTexto(
      certificado.vigenciaHasta,
    )}`;
  }

  hashCorto(hash: string): string {
    return hash.length > 16 ? `${hash.slice(0, 16)}…` : hash;
  }

  private estado(diasRestantes: number): EstadoCertificado {
    if (diasRestantes < 0) {
      return 'vencido';
    }
    return diasRestantes <= DIAS_ALERTA_VENCIMIENTO ? 'por-vencer' : 'vigente';
  }

  private diasRestantes(hasta: string, hoy: Date): number {
    const fin = new Date(`${hasta}T00:00:00`);
    const inicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      0,
      0,
      0,
    );
    return Math.round((fin.getTime() - inicio.getTime()) / 86_400_000);
  }

  private fechaEnTexto(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-').map((parte) => Number(parte));
    if (!anio || !mes || !dia) {
      return fecha;
    }
    return new Date(anio, mes - 1, dia).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
