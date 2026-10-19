import {
  ActividadPanel,
  MetricaPanel,
  TonoPanel,
} from '../Interface/panel.interface';

export const TITULO_PANEL = 'Panel Principal';

export const SUBTITULO_PANEL =
  'Indicadores de la Secretaría Académica: emisión de actas, trámites y verificaciones del período.';

export const ETIQUETA_NUEVA_EMISION = 'Nueva emisión de actas';

export const TITULO_FLUJO = 'Estado de las solicitudes';
export const SUBTITULO_FLUJO =
  'Seguimiento del período en curso sobre el total de radicados.';

export const TITULO_ACTIVIDAD = 'Actividad reciente';
export const TITULO_NOMINA = 'Nómina en curso';
export const ETIQUETA_IR_ACTAS = 'Abrir emisión de actas';

export const MENSAJE_SIN_NOMINA =
  'Todavía no hay una nómina cargada en el asistente de actas.';

/* ------------------------------------------------------------------
   Datos de demostración: los módulos de trámites y verificaciones aún
   no tienen backend. Se reemplazan por datos reales cuando existan.
   ------------------------------------------------------------------ */

export const METRICAS_PANEL: MetricaPanel[] = [
  {
    id: 'actas',
    label: 'Actas emitidas (mes)',
    valor: '1.248',
    icono: 'pi pi-file-edit',
    tono: 'brand',
    delta: '+12%',
    deltaTono: 'up',
    pie: 'frente a septiembre',
  },
  {
    id: 'tramites',
    label: 'Trámites pendientes',
    valor: '24',
    icono: 'pi pi-inbox',
    tono: 'warn',
    delta: '-3',
    deltaTono: 'up',
    pie: '3 vencen esta semana',
  },
  {
    id: 'verificaciones',
    label: 'Verificaciones hoy',
    valor: '89',
    icono: 'pi pi-shield',
    tono: 'info',
    delta: '+7%',
    deltaTono: 'up',
    pie: 'promedio 3,2 min por caso',
  },
  {
    id: 'firmas',
    label: 'Sellos digitales',
    valor: '12',
    icono: 'pi pi-verified',
    tono: 'ok',
    delta: 'Estable',
    deltaTono: 'flat',
    pie: 'certificado vigente hasta 2027',
  },
];

export const FLUJO_PANEL = [
  { id: 'radicados', label: 'Radicados', valor: 1240, tono: 'brand' as TonoPanel },
  { id: 'revision', label: 'En revisión', valor: 890, tono: 'info' as TonoPanel },
  { id: 'firma', label: 'Listos para firma', valor: 640, tono: 'warn' as TonoPanel },
  { id: 'entregados', label: 'Entregados', valor: 512, tono: 'ok' as TonoPanel },
];

export const ACTIVIDAD_PANEL: ActividadPanel[] = [
  {
    id: 'a1',
    titulo: 'Lote de actas emitido',
    detalle: '48 constancias de movilidad · Facultad de Salud',
    hace: 'Hace 12 minutos',
    icono: 'pi pi-file-pdf',
    tono: 'brand',
  },
  {
    id: 'a2',
    titulo: 'Requisitos verificados',
    detalle: 'ISABELLA BEDOYA NORIEGA · documento 1005980100',
    hace: 'Hace 40 minutos',
    icono: 'pi pi-check-circle',
    tono: 'ok',
  },
  {
    id: 'a3',
    titulo: 'Solicitud observada',
    detalle: 'Falta paz y salvo de biblioteca · radicado 2026-1842',
    hace: 'Hace 2 horas',
    icono: 'pi pi-exclamation-triangle',
    tono: 'warn',
  },
  {
    id: 'a4',
    titulo: 'Certificado digital renovado',
    detalle: 'Vigencia extendida hasta el 31 de diciembre de 2027',
    hace: 'Hace 5 horas',
    icono: 'pi pi-verified',
    tono: 'info',
  },
  {
    id: 'a5',
    titulo: 'Nómina cargada',
    detalle: '9 registros · 0 observaciones',
    hace: 'Ayer, 4:35 p. m.',
    icono: 'pi pi-cloud-upload',
    tono: 'brand',
  },
];
