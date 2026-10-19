import { TituloModulo } from '../Interface/layout.interface';

/** Título mostrado en el topbar para cada módulo. */
export const SGA_TITULOS: TituloModulo[] = [
  { ruta: '/panel', titulo: 'Panel Principal' },
  { ruta: '/actas', titulo: 'Herramientas Académicas · Emisión de Actas' },
  {
    ruta: '/verificador',
    titulo: 'Herramientas Académicas · Verificador de Requisitos',
  },
  {
    ruta: '/firma',
    titulo: 'Herramientas Académicas · Firma y Sello Digital',
  },
  { ruta: '/agenda', titulo: 'Gestión de Agenda y Calendarios Académicos' },
  { ruta: '/tramites', titulo: 'Gestión de Solicitudes (Kanban)' },
  { ruta: '/correo', titulo: 'Mesa de Control y Correspondencia' },
];

export const SGA_TITULO_POR_DEFECTO = 'SGA Univalle';
