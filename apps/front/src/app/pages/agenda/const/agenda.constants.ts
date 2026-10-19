import { EventoAgenda, TipoAgenda, TipoAgendaConfig } from '../Interface/agenda.interface';

export const TITULO_AGENDA = 'Agenda y Calendarios Académicos';

export const SUBTITULO_AGENDA =
  'Fechas límite del calendario académico, ceremonias de grado y turnos de atención al público.';

export const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const TITULO_PROXIMOS = 'Próximos eventos del mes';

export const MENSAJE_DEMO =
  'Calendario de demostración: las fechas se publicarán desde el sistema de planeación académica.';

export const SIN_EVENTOS = 'No hay eventos programados este mes para este calendario.';

export const TIPOS_AGENDA: TipoAgendaConfig[] = [
  {
    id: 'academico',
    label: 'Académico General',
    labelCorto: 'Académico',
    icono: 'pi pi-calendar-plus',
    descripcion: 'Calendario oficial de la Universidad del Valle',
  },
  {
    id: 'grados',
    label: 'Grados y Ceremonias',
    labelCorto: 'Grados',
    icono: 'pi pi-verified',
    descripcion: 'Ceremonias, ensayos y entrega de diplomas',
  },
  {
    id: 'atencion',
    label: 'Atención y Citas',
    labelCorto: 'Atención',
    icono: 'pi pi-users',
    descripcion: 'Turnos de atención al público y asesorías',
  },
];

/* ------------------------------------------------------------------
   Eventos de demostración (mientras no exista el módulo de planeación).
   ------------------------------------------------------------------ */
export const EVENTOS_AGENDA: Record<TipoAgenda, EventoAgenda[]> = {
  academico: [
    {
      id: 'ac1',
      titulo: 'Inicio de matrículas 2027-1',
      detalle: 'Apertura del sistema de matrícula para estudiantes antiguos.',
      hora: '8:00 a. m.',
      lugar: 'Portal académico',
      tono: 'brand',
      dia: 3,
    },
    {
      id: 'ac2',
      titulo: 'Registro de calificaciones parciales',
      detalle: 'Fecha límite para docentes de la Facultad de Salud.',
      hora: '11:59 p. m.',
      lugar: 'Portal docente',
      tono: 'warn',
      dia: 10,
    },
    {
      id: 'ac3',
      titulo: 'Cierre de notas 2026-2',
      detalle: 'Última jornada para cargar notas definitivas del semestre.',
      hora: '6:00 p. m.',
      lugar: 'Secretarías de programa',
      tono: 'warn',
      dia: 20,
    },
    {
      id: 'ac4',
      titulo: 'Sesión del Consejo de Facultad',
      detalle: 'Aprobación de casos de movilidad y constancias especiales.',
      hora: '2:00 p. m.',
      lugar: 'Sala 2-201 · Facultad de Salud',
      tono: 'info',
      dia: 22,
    },
    {
      id: 'ac5',
      titulo: 'Publicación de horarios 2027-1',
      detalle: 'Disponible para consulta de estudiantes y docentes.',
      hora: '9:00 a. m.',
      lugar: 'Portal académico',
      tono: 'ok',
      dia: 26,
    },
  ],
  grados: [
    {
      id: 'gr1',
      titulo: 'Ensayo general de ceremonia',
      detalle: 'Práctica de protocolo para graduandos de Medicina.',
      hora: '10:00 a. m.',
      lugar: 'Auditorio Alfonso Sanz S.J.',
      tono: 'info',
      dia: 14,
    },
    {
      id: 'gr2',
      titulo: 'Ceremonia de grados · Facultad de Salud',
      detalle: 'Entrega de actas y refrendación por la Secretaría Académica.',
      hora: '4:00 p. m.',
      lugar: 'Auditorio Alfonso Sanz S.J.',
      tono: 'brand',
      dia: 15,
    },
    {
      id: 'gr3',
      titulo: 'Entrega de diplomas',
      detalle: 'Los graduandos reclaman diplomas en la Secretaría Académica.',
      hora: '9:00 a. m.',
      lugar: 'Ventanilla única · Sede Meléndez',
      tono: 'ok',
      dia: 16,
    },
    {
      id: 'gr4',
      titulo: 'Juramento profesionales de Enfermería',
      detalle: 'Ceremonia solemne con tribunal de ética.',
      hora: '3:00 p. m.',
      lugar: 'Teatro Municipal Enrique Buenaventura',
      tono: 'brand',
      dia: 28,
    },
  ],
  atencion: [
    {
      id: 'at1',
      titulo: 'Atención al público · Secretaría Académica',
      detalle: 'Turnos para constancias, certificados y paz y salvos.',
      hora: '8:00 a. m. — 12:00 p. m.',
      lugar: 'Ventanilla única · Sede Meléndez',
      tono: 'brand',
      dia: 5,
    },
    {
      id: 'at2',
      titulo: 'Asesoría de movilidad académica',
      detalle: 'Acompañamiento a estudiantes de movilidad entrante y saliente.',
      hora: '2:00 p. m. — 4:00 p. m.',
      lugar: 'Oficina 2-118 · Facultad de Salud',
      tono: 'info',
      dia: 8,
    },
    {
      id: 'at3',
      titulo: 'Atención al público · Secretaría Académica',
      detalle: 'Turnos para constancias, certificados y paz y salvos.',
      hora: '8:00 a. m. — 12:00 p. m.',
      lugar: 'Ventanilla única · Sede Meléndez',
      tono: 'brand',
      dia: 12,
    },
    {
      id: 'at4',
      titulo: 'Consulta de certificados electrónicos',
      detalle: 'Soporte para verificación de folios y códigos QR.',
      hora: '9:00 a. m. — 11:00 a. m.',
      lugar: 'Sala de cómputo 2-305',
      tono: 'ok',
      dia: 21,
    },
    {
      id: 'at5',
      titulo: 'Atención al público · Secretaría Académica',
      detalle: 'Turnos para constancias, certificados y paz y salvos.',
      hora: '8:00 a. m. — 12:00 p. m.',
      lugar: 'Ventanilla única · Sede Meléndez',
      tono: 'brand',
      dia: 26,
    },
  ],
};
