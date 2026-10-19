export type EstadoCertificado = 'vigente' | 'por-vencer' | 'vencido';

/** Certificado institucional usado para refrendar las actas emitidas. */
export interface CertificadoDigital {
  titular: string;
  emisor: string;
  serie: string;
  algoritmo: string;
  vigenciaDesde: string;
  vigenciaHasta: string;
  huella: string;
  diasRestantes: number;
  estado: EstadoCertificado;
}

/** Registro de un sello aplicado a una constancia emitida. */
export interface SelloAplicado {
  id: string;
  folio: string;
  documento: string;
  nombre: string;
  fecha: string;
  hash: string;
  estado: 'firmado' | 'revocado';
}
