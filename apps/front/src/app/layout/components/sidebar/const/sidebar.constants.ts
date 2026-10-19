import {
  MarcaSga,
  NavEntrada,
  UsuarioShell,
} from '../Interface/sidebar.interface';

/** Icono de la flecha que indica si una sección del menú está desplegada. */
export const SIDEBAR_ICONO_CHEVRON = 'pi pi-chevron-down';

export const SIDEBAR_LOGO_TITULO = 'Ir al Panel Principal';

export const SIDEBAR_NAV_LABEL = 'Módulos del sistema';

export const SIDEBAR_PERFIL_LABEL = 'Funcionario en sesión';

/** Marca institucional del menú lateral. */
export const SIDEBAR_MARCA: MarcaSga = {
  nombre: 'SGA Univalle',
  subtitulo: 'Secretaría Académica',
  logo: 'assets/constancia/logo-univalle.png',
  logoAlt: 'Universidad del Valle',
};

export const SIDEBAR_USUARIO: UsuarioShell = {
  nombre: 'Secretaría Académica',
  dependencia: 'Sede Meléndez',
  iniciales: 'SA',
};

/**
 * Estructura del menú lateral. Refleja los módulos del sistema: panel,
 * herramientas académicas (actas, verificador, firma), agenda y calendarios,
 * gestión de solicitudes y mesa de control.
 */
export const SIDEBAR_MENU: NavEntrada[] = [
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

/** Secciones que inician desplegadas en el menú lateral. */
export const SIDEBAR_SECCIONES_ABIERTAS: Record<string, boolean> = {
  herramientas: false,
  agenda: false,
};
