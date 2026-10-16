import { CampoMapeo } from './step-validate.interface';

export const ARCHIVO_DEMO = 'cargue notas.xlsx';

export const MAPEO_CAMPOS: CampoMapeo[] = [
  { orden: 1, etiqueta: 'Universidad de Origen' },
  { orden: 2, etiqueta: 'CC (Documento)' },
  { orden: 3, etiqueta: 'Nombre del Estudiante' },
  { orden: 4, etiqueta: 'Asignatura 1 · Código / Nombre / Nota' },
  { orden: 5, etiqueta: 'Asignatura 2 · Código / Nombre / Nota' },
  { orden: 6, etiqueta: 'Asignatura 3 · Código / Nombre / Nota' },
];

export const TEXTO_BANNER_ERROR = 'Atención secretaría:';

export const TEXTO_SIN_ERRORES =
  '¡Excelente! Todos los estudiantes fueron validados y están listos para la emisión de constancias.';

export const PLACEHOLDER_BUSQUEDA =
  'Buscar por nombre, documento o universidad...';

export const ETIQUETA_AUTOFORMATO = 'Auto-formato';
