import { PasoActa } from '../Interface/actas-stepper.interface';

/**
 * Pasos del flujo de emisión, en el orden en que se muestran. El `id` coincide
 * con el índice del paso en el wizard.
 */
export const PASOS_ACTAS: PasoActa[] = [
  { id: 0, numero: 1, label: 'Cargar Datos', hint: 'Nómina en Excel' },
  { id: 1, numero: 2, label: 'Revisión de Lista', hint: 'Auditoría de requisitos' },
  { id: 2, numero: 3, label: 'Vista Previa A4', hint: 'Formato de impresión' },
  { id: 3, numero: 4, label: 'Generación Lote', hint: 'Descarga de actas' },
];

export const PASOS_LABEL = 'Pasos del flujo de emisión de actas';
