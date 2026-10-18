import { ColumnaIndice } from '../Interface/actas-index-table.interface';

export const INDICE_COLUMNAS: ColumnaIndice[] = [
  { id: 'numero', etiqueta: '#', clase: 'col-center col-num' },
  { id: 'folio', etiqueta: 'Nº de Folio' },
  { id: 'estudiante', etiqueta: 'Estudiante' },
  { id: 'documento', etiqueta: 'Documento (C.C.)' },
  { id: 'universidad', etiqueta: 'Universidad' },
  { id: 'archivo', etiqueta: 'Archivo PDF' },
  { id: 'acciones', etiqueta: 'Acciones', clase: 'col-center' },
];

export const INDICE_FILAS = 10;

export const INDICE_OPCIONES_FILAS = [10, 25, 50];

export const INDICE_VACIO =
  'No hay actas que coincidan con el alcance seleccionado.';

export const INDICE_ETIQUETA_PDF = 'Descargar PDF';
