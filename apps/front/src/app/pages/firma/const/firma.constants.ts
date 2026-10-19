import { CertificadoDigital, SelloAplicado } from '../Interface/firma.interface';

export const TITULO_FIRMA = 'Firma y Sello Digital';

export const SUBTITULO_FIRMA =
  'Certificado institucional con el que se refrendan las constancias emitidas por la Secretaría Académica.';

export const TITULO_CERTIFICADO = 'Certificado institucional';
export const TITULO_SELLOS = 'Sellos aplicados';

export const ETIQUETA_RENOVAR = 'Renovar certificado';
export const ETIQUETA_FICHA = 'Descargar ficha';
export const ETIQUETA_VER_SELLOS = 'Ver historial completo';

export const ETIQUETA_TITULAR = 'Titular';
export const ETIQUETA_EMISOR = 'Autoridad certificadora';
export const ETIQUETA_SERIE = 'Número de serie';
export const ETIQUETA_ALGORITMO = 'Algoritmo';
export const ETIQUETA_VIGENCIA = 'Vigencia';
export const ETIQUETA_HUELLA = 'Huella SHA-256';

export const ESTADOS_CERTIFICADO = {
  vigente: 'Vigente',
  'por-vencer': 'Por vencer',
  vencido: 'Vencido',
} as const;

export const DIAS_ALERTA_VENCIMIENTO = 60;

export const MENSAJE_DEMO =
  'Los sellos listados son de demostración: la firma se aplica sobre las actas que emites en el asistente.';

export const MENSAJE_RENOVAR =
  'La renovación del certificado se gestiona con la Oficina de Sistemas de la Universidad.';

export const MENSAJE_FICHA =
  'Ficha técnica del certificado generada en formato de demostración.';

/* ------------------------------------------------------------------
   Datos de demostración del certificado y de los sellos aplicados.
   ------------------------------------------------------------------ */
export const CERTIFICADO_DEMO: CertificadoDigital = {
  titular: 'SECRETARÍA ACADÉMICA · UNIVERSIDAD DEL VALLE',
  emisor: 'Certicámara S.A. — CA Institucional',
  serie: '4A:7F:19:C2:88:31:D0:5E',
  algoritmo: 'RSA 2048 · SHA-256',
  vigenciaDesde: '2026-01-01',
  vigenciaHasta: '2027-12-31',
  huella:
    '9f2c4b71a8e5d6034c9f1b8a7d2e5f4031ab7c9d8e2f5a6b3c1d4e7f8a9b0c1d',
  diasRestantes: 0,
  estado: 'vigente',
};

export const SELLOS_DEMO: SelloAplicado[] = [
  {
    id: 's1',
    folio: 'CM-2026-00048',
    documento: '1005980100',
    nombre: 'BEDOYA NORIEGA ISABELLA',
    fecha: '2026-10-18 08:42',
    hash: '3d7a91c4e0b52f6a8c1d4e7f9b2a5c8d',
    estado: 'firmado',
  },
  {
    id: 's2',
    folio: 'CM-2026-00047',
    documento: '1054987322',
    nombre: 'OCAMPO ZAPATA VALENTINA',
    fecha: '2026-10-18 08:41',
    hash: 'b8e2f5a6c1d4e7f9b2a5c8d3d7a91c4e',
    estado: 'firmado',
  },
  {
    id: 's3',
    folio: 'CM-2026-00046',
    documento: '1128456903',
    nombre: 'RIVAS MONTAÑO ALEJANDRO',
    fecha: '2026-10-17 16:20',
    hash: '6a8c1d4e7f9b2a5c8d3d7a91c4e0b52f',
    estado: 'firmado',
  },
  {
    id: 's4',
    folio: 'CM-2026-00045',
    documento: '1144098771',
    nombre: 'GÓMEZ SALCEDO MARIANA',
    fecha: '2026-10-17 15:58',
    hash: 'c8d3d7a91c4e0b52f6a8c1d4e7f9b2a5',
    estado: 'firmado',
  },
  {
    id: 's5',
    folio: 'CM-2026-00044',
    documento: '1093771204',
    nombre: 'PEÑA ARANGO JULIÁN',
    fecha: '2026-10-16 11:05',
    hash: 'f9b2a5c8d3d7a91c4e0b52f6a8c1d4e7',
    estado: 'revocado',
  },
];
