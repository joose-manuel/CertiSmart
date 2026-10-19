import { CasoVerificacion } from '../Interface/verificador.interface';

export const TITULO_VERIFICADOR = 'Verificador de Requisitos de Grado';

export const SUBTITULO_VERIFICADOR =
  'Comprobación de requisitos financieros, académicos y de paz y salvo antes de emitir el acta.';

export const ETIQUETA_CASO = 'Estudiante a verificar';

export const ETIQUETA_VERIFICAR = 'Ejecutar verificación';
export const ETIQUETA_VERIFICANDO = 'Verificando requisitos…';

export const TITULO_CHECKLIST = 'Lista de comprobación';
export const TITULO_VEREDICTO = 'Veredicto de la verificación';

export const VEREDICTO_APTO = 'Cumple todos los requisitos';
export const VEREDICTO_PENDIENTE = 'Cumple con observaciones';
export const VEREDICTO_BLOQUEADO = 'Requisitos bloqueantes sin resolver';
export const VEREDICTO_SIN_VERIFICAR = 'Pendiente de verificación';

export const MENSAJE_VERIFICACION_OK =
  'Verificación ejecutada: todos los requisitos quedaron en firme.';

export const MENSAJE_DEMO =
  'Verificación de demostración: los datos provienen de las dependencias, todavía sin integración en vivo.';

export const ETIQUETAS_ESTADO = {
  ok: 'En firme',
  pendiente: 'Pendiente',
  bloqueado: 'Bloqueante',
} as const;

/* ------------------------------------------------------------------
   Casos de demostración mientras no exista integración con registro,
   biblioteca y cartera.
   ------------------------------------------------------------------ */
export const CASOS_VERIFICACION: CasoVerificacion[] = [
  {
    documento: '1005980100',
    nombre: 'ISABELLA BEDOYA NORIEGA',
    programa: 'Medicina · Facultad de Salud',
    requisitos: [
      {
        id: 'academico',
        label: 'Requisitos académicos',
        detalle: 'Créditos aprobados y promedio de movilidad en firme.',
        estado: 'ok',
        icono: 'pi pi-book',
      },
      {
        id: 'financiero',
        label: 'Paz y salvo financiero',
        detalle: 'Sin obligaciones pendientes con la Universidad.',
        estado: 'ok',
        icono: 'pi pi-wallet',
      },
      {
        id: 'biblioteca',
        label: 'Paz y salvo de biblioteca',
        detalle: 'Devolución de material y carné al día.',
        estado: 'ok',
        icono: 'pi pi-bookmark',
      },
      {
        id: 'secretaria',
        label: 'Documentos de secretaría',
        detalle: 'Documento de identidad y acta de grado radicados.',
        estado: 'ok',
        icono: 'pi pi-folder-open',
      },
      {
        id: 'firma',
        label: 'Firma del director de programa',
        detalle: 'Pendiente de refrendación digital.',
        estado: 'pendiente',
        icono: 'pi pi-pencil',
      },
    ],
  },
  {
    documento: '1128456903',
    nombre: 'ALEJANDRO RIVAS MONTAÑO',
    programa: 'Enfermería · Facultad de Salud',
    requisitos: [
      {
        id: 'academico',
        label: 'Requisitos académicos',
        detalle: 'Créditos aprobados y promedio de movilidad en firme.',
        estado: 'ok',
        icono: 'pi pi-graduation-cap',
      },
      {
        id: 'financiero',
        label: 'Paz y salvo financiero',
        detalle: 'Dos cuotas de matrícula vencidas (semestre 2026-1).',
        estado: 'bloqueado',
        icono: 'pi pi-wallet',
      },
      {
        id: 'biblioteca',
        label: 'Paz y salvo de biblioteca',
        detalle: 'Material de laboratorio sin devolver.',
        estado: 'pendiente',
        icono: 'pi pi-book',
      },
      {
        id: 'secretaria',
        label: 'Documentos de secretaría',
        detalle: 'Documento de identidad y acta de grado radicados.',
        estado: 'ok',
        icono: 'pi pi-folder-open',
      },
      {
        id: 'firma',
        label: 'Firma del director de programa',
        detalle: 'No aplica hasta resolver los bloqueos.',
        estado: 'pendiente',
        icono: 'pi pi-pencil',
      },
    ],
  },
  {
    documento: '1054987322',
    nombre: 'VALENTINA OCAMPO ZAPATA',
    programa: 'Fisioterapia · Facultad de Salud',
    requisitos: [
      {
        id: 'academico',
        label: 'Requisitos académicos',
        detalle: 'Créditos aprobados y promedio de movilidad en firme.',
        estado: 'ok',
        icono: 'pi pi-graduation-cap',
      },
      {
        id: 'financiero',
        label: 'Paz y salvo financiero',
        detalle: 'Sin obligaciones pendientes con la Universidad.',
        estado: 'ok',
        icono: 'pi pi-wallet',
      },
      {
        id: 'biblioteca',
        label: 'Paz y salvo de biblioteca',
        detalle: 'Devolución de material y carné al día.',
        estado: 'ok',
        icono: 'pi pi-book',
      },
      {
        id: 'secretaria',
        label: 'Documentos de secretaría',
        detalle: 'Falta cargar el certificado de notas de movilidad.',
        estado: 'pendiente',
        icono: 'pi pi-folder-open',
      },
      {
        id: 'firma',
        label: 'Firma del director de programa',
        detalle: 'Certificado digital vigente y listo para sellar.',
        estado: 'ok',
        icono: 'pi pi-pencil',
      },
    ],
  },
];
