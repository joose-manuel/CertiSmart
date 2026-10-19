import { ColumnaKanban, Tramite } from '../Interface/tramites.interface';

export const TITULO_TRAMITES = 'Gestión de Solicitudes';

export const SUBTITULO_TRAMITES =
  'Tablero de trámites académicos: mueva las tarjetas entre columnas para actualizar su estado.';

export const ETIQUETA_NUEVO = 'Nuevo trámite';

export const MENSAJE_DEMO =
  'Tablero de demostración: los movimientos se conservan solo mientras dure esta sesión.';

export const MENSAJE_MOVIDO = 'Trámite reubicado correctamente.';
export const MENSAJE_NUEVO =
  'El registro de nuevos trámites se habilita con el módulo de radicación.';

export const SIN_TARJETAS = 'Sin trámites en esta columna';

export const PRIORIDADES = {
  alta: 'Prioridad alta',
  media: 'Prioridad media',
  baja: 'Prioridad baja',
} as const;

export const COLUMNAS_KANBAN: ColumnaKanban[] = [
  {
    id: 'radicados',
    label: 'Radicados',
    descripcion: 'Solicitudes recibidas en ventanilla',
    tono: 'info',
  },
  {
    id: 'revision',
    label: 'En revisión',
    descripcion: 'Verificación de requisitos',
    tono: 'warn',
  },
  {
    id: 'firma',
    label: 'Listos para firma',
    descripcion: 'Pendientes de refrendación',
    tono: 'brand',
  },
  {
    id: 'entregados',
    label: 'Entregados',
    descripcion: 'Notificados al solicitante',
    tono: 'ok',
  },
];

/* ------------------------------------------------------------------
   Trámites de demostración mientras no exista radicación en backend.
   ------------------------------------------------------------------ */
export const TRAMITES_DEMO: Tramite[] = [
  {
    id: 't1',
    radicado: '2026-1841',
    titulo: 'Constancia de notas de movilidad',
    solicitante: 'ISABELLA BEDOYA NORIEGA',
    programa: 'Medicina',
    prioridad: 'alta',
    columnaId: 'radicados',
    diasEnCola: 1,
    etiqueta: 'Constancia',
  },
  {
    id: 't2',
    radicado: '2026-1842',
    titulo: 'Paz y salvo de biblioteca',
    solicitante: 'ALEJANDRO RIVAS MONTAÑO',
    programa: 'Enfermería',
    prioridad: 'alta',
    columnaId: 'revision',
    diasEnCola: 3,
    etiqueta: 'Paz y salvo',
  },
  {
    id: 't3',
    radicado: '2026-1843',
    titulo: 'Duplicado de acta de grado',
    solicitante: 'VALENTINA OCAMPO ZAPATA',
    programa: 'Fisioterapia',
    prioridad: 'media',
    columnaId: 'revision',
    diasEnCola: 2,
    etiqueta: 'Certificación',
  },
  {
    id: 't4',
    radicado: '2026-1844',
    titulo: 'Certificado de notas semestre 2026-1',
    solicitante: 'MARIANA GÓMEZ SALCEDO',
    programa: 'Medicina',
    prioridad: 'baja',
    columnaId: 'radicados',
    diasEnCola: 1,
    etiqueta: 'Certificación',
  },
  {
    id: 't5',
    radicado: '2026-1845',
    titulo: 'Homologación de asignaturas de movilidad',
    solicitante: 'JULIÁN PEÑA ARANGO',
    programa: 'Enfermería',
    prioridad: 'alta',
    columnaId: 'firma',
    diasEnCola: 5,
    etiqueta: 'Homologación',
  },
  {
    id: 't6',
    radicado: '2026-1846',
    titulo: 'Constancia de estudio vigente',
    solicitante: 'DANIELA TORRES MEJÍA',
    programa: 'Fisioterapia',
    prioridad: 'media',
    columnaId: 'firma',
    diasEnCola: 2,
    etiqueta: 'Constancia',
  },
  {
    id: 't7',
    radicado: '2026-1847',
    titulo: 'Actualización de datos de contacto',
    solicitante: 'SEBASTIÁN LÓPEZ CEBALLOS',
    programa: 'Medicina',
    prioridad: 'baja',
    columnaId: 'entregados',
    diasEnCola: 8,
    etiqueta: 'Actualización',
  },
  {
    id: 't8',
    radicado: '2026-1848',
    titulo: 'Constancia de notas de movilidad',
    solicitante: 'CAMILA RESTREPO GIL',
    programa: 'Enfermería',
    prioridad: 'media',
    columnaId: 'entregados',
    diasEnCola: 6,
    etiqueta: 'Constancia',
  },
  {
    id: 't9',
    radicado: '2026-1849',
    titulo: 'Revisión de paz y salvo financiero',
    solicitante: 'ANDRÉS FELIPE MUÑOZ',
    programa: 'Medicina',
    prioridad: 'alta',
    columnaId: 'radicados',
    diasEnCola: 0,
    etiqueta: 'Paz y salvo',
  },
  {
    id: 't10',
    radicado: '2026-1850',
    titulo: 'Certificación para trámite de beca',
    solicitante: 'LAURA SOFÍA CASTILLO',
    programa: 'Fisioterapia',
    prioridad: 'media',
    columnaId: 'revision',
    diasEnCola: 4,
    etiqueta: 'Certificación',
  },
  {
    id: 't11',
    radicado: '2026-1851',
    titulo: 'Entrega de acta refrendada',
    solicitante: 'NICOLÁS HERNÁNDEZ VÉLEZ',
    programa: 'Enfermería',
    prioridad: 'baja',
    columnaId: 'entregados',
    diasEnCola: 9,
    etiqueta: 'Acta de grado',
  },
];
