/** Helpers para convertir Blobs del backend en descargas reales. */
export function descargarBlob(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo || 'descarga';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

/** Mensaje legible a partir de un error HTTP (maneja cuerpos tipo Blob). */
export async function mensajeHttpError(
  error: unknown,
  fallback: string,
): Promise<string> {
  const err = error as { status?: number; error?: unknown };
  if (!err) {
    return fallback;
  }
  if (err.status === 0) {
    return (
      'No se pudo conectar con el backend. ' +
      'Verifica que `npm run back` esté corriendo en otra terminal.'
    );
  }
  if (err.error instanceof Blob) {
    try {
      const texto = await err.error.text();
      const json = JSON.parse(texto);
      return String(json?.message ?? fallback);
    } catch {
      /* ignorar */
    }
  }
  const cuerpo = err.error as { message?: string } | null;
  if (cuerpo && typeof cuerpo.message === 'string') {
    return cuerpo.message;
  }
  return fallback;
}
