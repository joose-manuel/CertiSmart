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

/** Datos de marca del shell (logo institucional y dependencia). */
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

/** Título que el topbar muestra según la ruta activa. */
export interface TituloModulo {
  ruta: string;
  titulo: string;
}
