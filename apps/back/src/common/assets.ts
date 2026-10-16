import { join } from 'node:path';

/**
 * Los recursos (fuentes e imágenes de la constancia) se copian junto al código
 * compilado mediante la opción `assets` de project.json, así que en runtime
 * viven al lado de `main.js`: dist/apps/back/assets/...
 */
export const RUTA_ASSETS = join(__dirname, '..', 'assets');
export const RUTA_FUENTES = join(RUTA_ASSETS, 'fonts');
export const RUTA_IMAGENES = join(RUTA_ASSETS, 'constancia');

export const RUTA_FONDO = join(RUTA_IMAGENES, 'plantilla-fondo.jpg');
export const RUTA_LOGO = join(RUTA_IMAGENES, 'logo-univalle.png');
export const RUTA_SELLO = join(RUTA_IMAGENES, 'sello-facultad-salud.png');
export const RUTA_FIRMA = join(RUTA_IMAGENES, 'firma-director.png');

export const RUTA_FUENTE_NORMAL = join(RUTA_FUENTES, 'Tinos-Regular.ttf');
export const RUTA_FUENTE_BOLD = join(RUTA_FUENTES, 'Tinos-Bold.ttf');
