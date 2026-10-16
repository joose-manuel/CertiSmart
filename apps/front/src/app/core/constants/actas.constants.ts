import {
  ActaConfig,
  Autoridad,
  FormatoNombre,
  Institucion,
} from '../models/acta.model';
import { CodigoError } from '../models/estudiante.model';

export const INSTITUCION: Institucion = {
  nombre: 'Universidad del Valle',
  dependencia: 'Facultad de Salud · Programa Académico de Medicina',
  dominioVerificacion: 'https://salud.univalle.edu.co/constancias',
};

export const TITULO_CONSTANCIA = 'CONSTANCIA DE NOTAS MOVILIDAD ACADÉMICA';

/** Ciudad que encabeza la constancia: «Santiago de Cali, 15 de octubre…» */
export const CIUDAD_EXPEDICION = 'Santiago de Cali';

export const PROGRAMA_ACADEMICO = 'Programa de Medicina';

/** Autoridad firmante de la constancia (plantilla oficial en Word). */
export const DIRECTOR_PROGRAMA: Autoridad = {
  id: 'director-medicina',
  nombre: 'JOSÉ DANIEL OSORIO OROZCO, MD',
  cargo: 'Director Programa Académico de Medicina',
};

export const FOLIO_PREFIJO = 'CM-2026-';

export const ACTA_CONFIG_DEFAULT: ActaConfig = {
  folioInicial: 1,
  fechaExpedicion: '2026-10-15',
  codigoQr: false,
  marcaAgua: false,
  estampaTiempo: false,
};

export const FORMATOS_NOMBRE: { value: FormatoNombre; label: string }[] = [
  { value: 'documento_nombre', label: 'Documento + Nombre completo' },
  { value: 'folio_documento', label: 'Nº de constancia + Documento' },
];

/** Formato de nombre recomendado por la secretaría. */
export const FORMATO_RECOMENDADO: FormatoNombre = 'documento_nombre';

export const ERROR_LABELS: Record<CodigoError, string> = {
  UNIVERSIDAD_FALTANTE: 'Falta universidad de origen',
  DOCUMENTO_FALTANTE: 'Falta documento (C.C.)',
  NOMBRE_FALTANTE: 'Falta nombre del estudiante',
  SIN_ASIGNATURAS: 'Sin asignaturas (rotaciones)',
  ASIGNATURA_INCOMPLETA: 'Asignatura sin código o nombre',
  NOTA_NO_NUMERICA: 'Nota no numérica',
  NOTA_FUERA_RANGO: 'Nota fuera de rango (0 a 5)',
};

/**
 * Columnas esperadas del Excel «cargue notas»: datos del estudiante y hasta
 * 3 bloques de asignatura (código · nombre · nota).
 */
export const COLUMNAS_ESPERADAS: string[] = [
  'UNIVERSIDAD',
  'CC',
  'NOMBRE ESTUDIANTE',
  'CÓDIGO DE ASIGNATURA 1',
  'NOMBRE ASIGNATURA 1',
  'NOTA 1',
  'CÓDIGO DE ASIGNATURA 2',
  'NOMBRE ASIGNATURA 2',
  'NOTA 2',
  'CÓDIGO DE ASIGNATURA 3',
  'NOMBRE ASIGNATURA 3',
  'NOTA 3',
];

export const MAX_ARCHIVO_MB = 25;
export const MAX_ESTUDIANTES_LOTE = 2000;
export const EXTENSIONES_PERMITIDAS = ['.xlsx'];

export const MESES_ES: string[] = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
