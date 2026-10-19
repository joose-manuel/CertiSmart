export const TOTAL_PASOS = 4;

export const PASO_CARGA = 0;
export const PASO_VALIDACION = 1;
export const PASO_PLANTILLA = 2;
export const PASO_EXPORTACION = 3;

export const PASO_INICIAL = PASO_CARGA;

/* ---------------- Cabecera del módulo ---------------- */
export const TITULO_MODULO = 'Generador de Actas Académicas';

export const SUBTITULO_MODULO =
  'Carga la nómina oficial, audita los requisitos de grado y emite las constancias en lote.';

export const ETIQUETA_VALIDAR = 'Validar Registros';
export const ETIQUETA_PLANTILLA = 'Estructura XLSX';
export const TITULO_AVISO_PLANTILLA = 'Plantilla oficial';
export const TITULO_AVISO_VALIDAR = 'Auditoría de la nómina';

export const MENSAJE_SIN_NOMINA =
  'Carga primero una nómina para poder auditar los registros.';

/* ---------------- Banner de auditoría ---------------- */
export const AUDITORIA_TITULO = 'Auditoría de la Nómina';
export const AUDITORIA_CHIP = 'Procesada';

export const AUDITORIA_DETALLE =
  'Resumen calculado sobre la nómina cargada. Las filas con observaciones se resuelven en el paso de revisión.';

export const AUDITORIA_ACCION = 'Ver observaciones';
