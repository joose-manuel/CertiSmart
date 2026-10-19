import { MensajeControl, OpcionFiltro } from '../Interface/correo.interface';

export const TITULO_CORREO = 'Mesa de Control · Correo Institucional';

export const SUBTITULO_CORREO =
  'Comunicaciones de las dependencias sobre actas, certificados y solicitudes académicas.';

export const TITULO_BUZON = 'Bandeja de entrada';
export const TITULO_DETALLE = 'Detalle del mensaje';
export const SIN_SELECCION = 'Selecciona un mensaje para ver su contenido.';
export const SIN_MENSAJES = 'No hay mensajes en esta vista.';

export const ETIQUETA_MARCA_ATENDIDO = 'Marcar atendido';
export const ETIQUETA_RESPONDER = 'Responder';
export const ETIQUETA_ARCHIVAR = 'Archivar';
export const ETIQUETA_QUITAR_FILTRO = 'Ver todos los mensajes';

export const MENSAJE_DEMO =
  'Buzón de demostración: los mensajes se reinician al recargar la página.';

export const MENSAJE_ATENDIDO = 'Mensaje marcado como atendido.';
export const MENSAJE_RESPUESTA =
  'La bandeja de salida se habilita con el servidor de correo institucional.';
export const MENSAJE_ARCHIVADO = 'Mensaje archivado en el histórico de la mesa de control.';

export const FILTROS_CORREO: OpcionFiltro[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendientes', value: 'pendientes' },
];

/* ------------------------------------------------------------------
   Mensajes de demostración mientras no exista la integración con el
   servidor de correo institucional.
   ------------------------------------------------------------------ */
export const MENSAJES_DEMO: MensajeControl[] = [
  {
    id: 'm1',
    remitente: 'Facultad de Salud · Registro Académico',
    asunto: 'Nómina de movilidad lista para emisión de actas',
    resumen:
      'Se cargó la nómina de 9 estudiantes de movilidad del período 2026-2.',
    cuerpo:
      'Buen día, Secretaría Académica.\n\nAdjuntamos la nómina de movilidad académica del período 2026-2 con 9 estudiantes habilitados para la emisión de constancias de notas. Verificamos que todos los registros cuentan con el paz y salvo financiero y el aval del director de programa.\n\nQuedamos atentos a la emisión del lote para notificar a los estudiantes el retiro de sus documentos.',
    fecha: '18 oct 2026',
    hora: '8:42 a. m.',
    etiqueta: 'Emisión',
    tono: 'brand',
    noLeido: true,
    adjuntos: 2,
    atendido: false,
  },
  {
    id: 'm2',
    remitente: 'Biblioteca Central · Préstamos',
    asunto: 'Paz y salvo pendiente: Alejandro Rivas Montaño',
    resumen:
      'El estudiante tiene material de laboratorio sin devolver desde el 2 de octubre.',
    cuerpo:
      'Cordial saludo.\n\nEl estudiante ALEJANDRO RIVAS MONTAÑO presenta material de laboratorio pendiente por devolver (2 cajas de instrumental) desde el 2 de octubre de 2026. Mientras el préstamo siga activo no es posible emitir el paz y salvo de biblioteca.\n\nSolicitamos gestionar la devolución con el estudiante antes de continuar con la radicación de sus requisitos de grado.',
    fecha: '17 oct 2026',
    hora: '4:15 p. m.',
    etiqueta: 'Paz y salvo',
    tono: 'warn',
    noLeido: true,
    adjuntos: 1,
    atendido: false,
  },
  {
    id: 'm3',
    remitente: 'Oficina de Sistemas',
    asunto: 'Renovación del certificado digital institucional',
    resumen:
      'El certificado fue renovado y su vigencia se extiende hasta diciembre de 2027.',
    cuerpo:
      'Estimada Secretaría Académica.\n\nInformamos que el certificado digital institucional usado para refrendar las constancias fue renovado. La nueva vigencia se extiende hasta el 31 de diciembre de 2027 y la huella SHA-256 fue actualizada en el sistema de firma.\n\nNo es necesario realizar ninguna acción adicional; los sellos aplicados a partir de hoy utilizan la nueva clave.',
    fecha: '17 oct 2026',
    hora: '11:03 a. m.',
    etiqueta: 'Firma',
    tono: 'ok',
    noLeido: false,
    adjuntos: 0,
    atendido: true,
  },
  {
    id: 'm4',
    remitente: 'Consejo de Facultad',
    asunto: 'Homologaciones aprobadas en la sesión del 15 de octubre',
    resumen:
      'Siete solicitudes de homologación de movilidad quedaron aprobadas.',
    cuerpo:
      'Respetados colegas.\n\nEn la sesión ordinaria del 15 de octubre de 2026 el Consejo de Facultad aprobó siete solicitudes de homologación de asignaturas provenientes de movilidad académica. El acta de la sesión se remite adjunta para la actualización de los registros académicos.\n\nAgradecemos incorporar las homologaciones antes del cierre de notas del semestre.',
    fecha: '16 oct 2026',
    hora: '2:40 p. m.',
    etiqueta: 'Académico',
    tono: 'info',
    noLeido: false,
    adjuntos: 1,
    atendido: false,
  },
  {
    id: 'm5',
    remitente: 'ISABELLA BEDOYA NORIEGA',
    asunto: 'Consulta por constancia de notas de movilidad',
    resumen:
      'Pregunta si puede reclamar su constancia antes de la ceremonia de grado.',
    cuerpo:
      'Buen día.\n\nSoy estudiante de Medicina y realicé movilidad académica en el período 2026-1. Quisiera saber si es posible reclamar la constancia de notas de movilidad antes de la ceremonia de grado del 15 de noviembre, ya que la requiere el consulado para un trámite de visa académica.\n\nQuedo atenta a su respuesta y agradezco su gestión.',
    fecha: '15 oct 2026',
    hora: '9:27 a. m.',
    etiqueta: 'Solicitud',
    tono: 'info',
    noLeido: false,
    adjuntos: 0,
    atendido: false,
  },
  {
    id: 'm6',
    remitente: 'Oficina de Egresados',
    asunto: 'Entrega de diplomas para graduandos de Enfermería',
    resumen:
      'Los diplomas estarán disponibles el 16 de octubre en ventanilla única.',
    cuerpo:
      'Apreciada Secretaría Académica.\n\nConfirmamos la entrega de diplomas para los graduandos de Enfermería el próximo 16 de octubre de 2026 en la ventanilla única de la Sede Meléndez, de 9:00 a. m. a 4:00 p. m.\n\nSolicitamos apoyar la verificación de identidad y el registro de entrega en el sistema.',
    fecha: '14 oct 2026',
    hora: '5:05 p. m.',
    etiqueta: 'Grados',
    tono: 'brand',
    noLeido: false,
    adjuntos: 0,
    atendido: true,
  },
];
