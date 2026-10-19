import { NavBadge } from '../../../Interface/layout.interface';

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
