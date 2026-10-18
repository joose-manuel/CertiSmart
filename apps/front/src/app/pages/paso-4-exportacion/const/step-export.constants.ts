import { FORMATOS_NOMBRE } from '../../../core/constants/actas.constants';
import { FormatoNombre } from '../../../core/models/acta.model';
import {
  EtiquetasResumenLote,
  OpcionModo,
  PasoGeneracion,
} from '../Interface/step-export.interface';

export const TITULO_EXPORTACION = 'Exportación Masiva de Constancias';

export const SUBTITULO_EXPORTACION =
  'Define el alcance, asigna los folios y descarga los PDF de cada estudiante';

export const ETIQUETA_ALCANCE = 'Alcance de la exportación';

export const ETIQUETA_MODO = 'Registros a incluir';

export const ETIQUETA_FORMATO = 'Nombre de cada archivo PDF';

export const ETIQUETA_DESDE = 'Desde el registro';

export const ETIQUETA_HASTA = 'Hasta el registro';

export const AYUDA_RANGO =
  'Se folian en el orden del archivo original, desde «Desde» hasta «Hasta».';

export const TEXTO_RANGO_INVALIDO =
  'El registro «Desde» no puede superar a «Hasta».';

export const ETIQUETA_INCLUIR_INVALIDOS =
  'Emitir también los registros con inconsistencias';

export const AYUDA_INCLUIR_INVALIDOS =
  'Si lo desactivas, los registros con errores quedan fuera del lote y no consumen folio.';

export const ETIQUETA_PAQUETE = 'Nombre del paquete ZIP';

export const AYUDA_PAQUETE =
  'Se descargará con este nombre; se añade la fecha de expedición.';

export const TITULO_SEGURIDAD = 'Sellos y trazabilidad del lote';

export const ETIQUETA_HASH = 'Hash SHA-256 por constancia';

export const ETIQUETA_QR = 'QR de verificación pública';

export const ETIQUETA_ESTAMPA = 'Estampa cronológica';

export const TEXTO_ESTAMPADA_ACTIVA = 'Activa en el pie de cada constancia';

export const TEXTO_ESTAMPADA_INACTIVA = 'Desactivada en la plantilla';

export const ETIQUETA_DIGESTS = 'digests';

export const ETIQUETA_VIGENCIA = 'Vigencia del lote en el servidor';

export const TEXTO_HASH_SIMULADO =
  'Vista previa local: el hash definitivo lo calcula el servidor al foliar.';

export const TITULO_INDICE = 'Índice de folios del lote';

export const DESCRIPCION_INDICE =
  'Revisa la foliación antes de generar. Cada constancia es un PDF independiente del paquete ZIP.';

export const ETIQUETA_GENERAR = 'Generar lote de constancias';

export const ETIQUETA_GENERANDO = 'Generando lote…';

export const TEXTO_GENERANDO =
  'No cierres esta ventana: se están foliando y sellando las constancias.';

export const TITULO_LOTE_LISTO = 'Lote generado correctamente';

export const TEXTO_LOTE_LISTO =
  'Cada constancia se generó con su folio y hash de verificación. El paquete ZIP ya está disponible para descarga.';

export const ETIQUETA_DESCARGAR_ZIP = 'Descargar ZIP';

export const ETIQUETA_DESCARGAR_CERTIFICADO = 'Certificado de auditoría';

export const ETIQUETA_NUEVO_LOTE = 'Iniciar nuevo lote';

export const ETIQUETA_AJUSTAR_ALCANCE = 'Ajustar alcance';

export const ETIQUETA_VOLVER = 'Volver a Plantilla';

export const ETIQUETA_RECOMENDADA = 'Recomendada';

export const ETIQUETA_EJEMPLO = 'Ejemplo:';

export const ETIQUETA_ACTAS = 'constancias';

/** Etiquetas de las casillas del resumen del lote generado. */
export const ETIQUETAS_RESUMEN_LOTE: EtiquetasResumenLote = {
  zip: 'Paquete ZIP',
  actas: 'Constancias emitidas',
  folios: 'Folios',
  tamano: 'Tamaño',
  hash: 'Hash del lote (SHA-256)',
  generado: 'Generado',
};

export const TEXTO_INTEGRACION =
  'Descarga pendiente de integración con el backend (F3 del plan de actas).';

export const TEXTO_CERTIFICADO_INTEGRACION =
  'El certificado de auditoría se emitirá desde el backend (F4 del plan de actas).';

export const TEXTO_DESCARGAR_ACTA =
  'Re-descarga individual pendiente de integración con el backend (F3 del plan de actas).';

export const ETIQUETA_EXCLUIDOS = 'fuera del lote';

export const TEXTO_ALCANCE_VACIO =
  'La selección actual no incluye ninguna constancia. Ajusta el alcance para continuar.';

export const VIGENCIA_LOTE_MIN = 60;

export const PASOS_GENERACION: PasoGeneracion[] = [
  { etiqueta: 'Validando selección y reglas de negocio', porcentaje: 8 },
  { etiqueta: 'Asignando folios consecutivos', porcentaje: 26 },
  { etiqueta: 'Calculando hash SHA-256 por constancia', porcentaje: 46 },
  { etiqueta: 'Generando códigos QR de verificación', porcentaje: 64 },
  { etiqueta: 'Renderizando constancias en PDF (tamaño carta)', porcentaje: 88 },
  { etiqueta: 'Empaquetando el ZIP del lote', porcentaje: 100 },
];

export const PASO_TICK_MS = 420;

/** Peso medio de una constancia tamaño carta, usado para estimar el ZIP. */
export const PESO_MEDIO_ACTA_BYTES = 126_000;

export const MODO_BASE: OpcionModo[] = [
  {
    label: 'Solo válidos',
    value: 'valid',
    detalle: 'Emiten constancia los registros sin inconsistencias',
  },
  {
    label: 'Todos',
    value: 'all',
    detalle: 'Todos los registros cargados, marcando los observados',
  },
  {
    label: 'Seleccionados',
    value: 'selected',
    detalle: 'Solo los marcados con la casilla en el validador',
  },
  {
    label: 'Rango',
    value: 'range',
    detalle: 'Un tramo consecutivo del archivo original',
  },
];

export const FORMATOS_DISPONIBLES: {
  label: string;
  value: FormatoNombre;
}[] = FORMATOS_NOMBRE;
