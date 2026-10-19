import {
  MarcaSga,
  NavEntrada,
  TituloModulo,
  UsuarioShell,
} from '../Interface/layout.interface';

/** Marca institucional del shell. */
export const SGA_MARCA: MarcaSga = {
  nombre: 'SGA Univalle',
  subtitulo: 'Secretaría Académica',
  logo: 'assets/constancia/logo-univalle.png',
  logoAlt: 'Universidad del Valle',
};

export const SGA_USUARIO: UsuarioShell = {
  nombre: 'Secretaría Académica',
  dependencia: 'Sede Meléndez',
  iniciales: 'SA',
};

export const SGA_PERIODO = 'Período Académico 2026-II';

export const SGA_BUSQUEDA_PLACEHOLDER = 'Buscar estudiante, acta o trámite...';

/**
 * Estructura del menú lateral. Refleja los módulos del sistema: panel,
 * herramientas académicas (actas, verificador, firma), agenda y calendarios,
 * gestión de solicitudes y mesa de control.
 */
export const SGA_MENU: NavEntrada[] = [
  {
    id: 'panel',
    label: 'Panel Principal',
    icono: 'pi pi-th-large',
    ruta: '/panel',
  },
  {
    id: 'herramientas',
    label: 'Herramientas Académicas',
    icono: 'pi pi-wrench',
    hijos: [
      {
        id: 'actas',
        label: 'Emisión de Actas',
        icono: 'pi pi-file-edit',
        ruta: '/actas',
      },
      {
        id: 'verificador',
        label: 'Verificador de Requisitos',
        icono: 'pi pi-shield',
        ruta: '/verificador',
      },
      {
        id: 'firma',
        label: 'Firma y Sello Digital',
        icono: 'pi pi-verified',
        ruta: '/firma',
      },
    ],
  },
  {
    id: 'agenda',
    label: 'Agenda y Calendarios',
    icono: 'pi pi-calendar',
    hijos: [
      {
        id: 'agenda-academico',
        label: 'Académico General',
        icono: 'pi pi-calendar-plus',
        ruta: '/agenda/academico',
      },
      {
        id: 'agenda-grados',
        label: 'Grados y Ceremonias',
        icono: 'pi pi-verified',
        ruta: '/agenda/grados',
      },
      {
        id: 'agenda-atencion',
        label: 'Atención y Citas',
        icono: 'pi pi-users',
        ruta: '/agenda/atencion',
      },
    ],
  },
  {
    id: 'tramites',
    label: 'Gestión de Solicitudes',
    icono: 'pi pi-table',
    ruta: '/tramites',
    badge: { valor: 12, tono: 'ambar' },
  },
  {
    id: 'correo',
    label: 'Mesa de Control',
    icono: 'pi pi-inbox',
    ruta: '/correo',
    badge: { valor: 4, tono: 'rojo' },
  },
];

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

/** Secciones que inician desplegadas en el menú lateral. */
export const SGA_SECCIONES_ABIERTAS: Record<string, boolean> = {
  herramientas: false,
  agenda: false,
};
