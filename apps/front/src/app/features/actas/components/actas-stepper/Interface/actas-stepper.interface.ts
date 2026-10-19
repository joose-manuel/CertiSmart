/** Definición estática de un paso del flujo de emisión. */
export interface PasoActa {
  id: number;
  numero: number;
  label: string;
  hint: string;
}

/** Paso ya resuelto para la vista (activo, completado o bloqueado). */
export interface PasoActaVista extends PasoActa {
  activo: boolean;
  completado: boolean;
  habilitado: boolean;
}
