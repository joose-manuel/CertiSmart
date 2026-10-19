/** Tono de los contadores que se muestran en el menú lateral. */
export type TonoBadge = 'rojo' | 'ambar';

export interface NavBadge {
  valor: number;
  tono: TonoBadge;
}

/** Opción simple del menú (sin hijos). */
export interface NavItem {
  id: string;
  label: string;
  icono: string;
  ruta?: string;
  badge?: NavBadge;
}

/** Sección del menú que despliega submenú. */
export interface NavSeccion {
  id: string;
  label: string;
  icono: string;
  hijos: NavItem[];
}

export type NavEntrada = NavItem | NavSeccion;

export function esSeccion(entrada: NavEntrada): entrada is NavSeccion {
  return Array.isArray((entrada as NavSeccion).hijos);
}

/** Datos de marca del encabezado del menú (logo institucional y dependencia). */
export interface MarcaSga {
  nombre: string;
  subtitulo: string;
  logo: string;
  logoAlt: string;
}

/** Funcionario que aparece al pie del menú lateral. */
export interface UsuarioShell {
  nombre: string;
  dependencia: string;
  iniciales: string;
}

/** Hijo del menú ya resuelto para la vista (con estado activo). */
export interface HijoMenuVista {
  id: string;
  label: string;
  ruta: string;
  icono: string;
  activo: boolean;
}

/** Entrada del menú lateral lista para pintar (sección o enlace simple). */
export interface EntradaMenuVista {
  id: string;
  label: string;
  icono: string;
  esSeccion: boolean;
  activo: boolean;
  abierta: boolean;
  ruta?: string;
  badge?: NavBadge;
  hijos: HijoMenuVista[];
}
