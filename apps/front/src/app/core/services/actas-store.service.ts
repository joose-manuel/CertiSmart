import { Injectable } from '@angular/core';
import { ACTA_CONFIG_DEFAULT } from '../constants/actas.constants';
import { ActaConfig } from '../models/acta.model';
import {
  Asignatura,
  calcularResumen,
  EdicionEstudiante,
  Estudiante,
  ResumenValidacion,
  validarEstudiante,
} from '../models/estudiante.model';

/**
 * Servicio de estado en memoria del lote de constancias.
 * Solo memoria (sin base de datos); los estudiantes llegan del backend.
 */
@Injectable({ providedIn: 'root' })
export class ActasStoreService {
  private estudiantes: Estudiante[] = [];
  private config: ActaConfig = { ...ACTA_CONFIG_DEFAULT };
  private folioActual = ACTA_CONFIG_DEFAULT.folioInicial;

  get lista(): Estudiante[] {
    return this.estudiantes;
  }

  get configuracion(): ActaConfig {
    return this.config;
  }

  get resumen(): ResumenValidacion {
    return calcularResumen(this.estudiantes);
  }

  get validos(): Estudiante[] {
    return this.estudiantes.filter((e) => e.estado === 'valido');
  }

  get seleccionados(): Estudiante[] {
    return this.estudiantes.filter((e) => e.seleccionado);
  }

  get seleccionadosCount(): number {
    return this.seleccionados.length;
  }

  get hayDatos(): boolean {
    return this.estudiantes.length > 0;
  }

  get folioInicial(): number {
    return this.folioActual;
  }

  /** Carga la nómina analizada por el backend (servidor autoritativo). */
  cargarDesdeServidor(raw: unknown): void {
    const lista = Array.isArray(raw) ? raw : [];
    const procesados: Estudiante[] = (lista as any[]).map((base, indice) =>
      this.mapear(base, indice),
    );

    this.estudiantes = procesados;
    this.folioActual = this.config.folioInicial;
  }

  private mapear(base: any, indice: number): Estudiante {
    const asignaturas = Array.isArray(base?.asignaturas)
      ? base.asignaturas.map((asignatura: any) => ({
          codigo: String(asignatura?.codigo ?? '').trim(),
          nombre: String(asignatura?.nombre ?? '').trim(),
          nota:
            asignatura?.nota === null || asignatura?.nota === undefined
              ? null
              : Number(asignatura.nota),
        }))
      : [];

    const estudiante: Estudiante = {
      id: Number.isFinite(base?.id) ? Number(base.id) : indice + 1,
      universidad: String(base?.universidad ?? '').trim(),
      documento: String(base?.documento ?? '').trim(),
      nombreCompleto: String(base?.nombreCompleto ?? '').trim(),
      asignaturas,
      estado: base?.estado === 'valido' ? 'valido' : 'error',
      errores: Array.isArray(base?.errores)
        ? (base.errores as any[])
        : [],
      seleccionado: base?.estado === 'valido',
    };

    return estudiante;
  }

  limpiar(): void {
    this.estudiantes = [];
  }

  aplicarAutoFormato(): void {
    this.estudiantes = this.estudiantes.map((estudiante) => {
      const limpio: Estudiante = {
        ...estudiante,
        universidad: estudiante.universidad.trim().replace(/\s+/g, ' '),
        documento: estudiante.documento.trim(),
        nombreCompleto: estudiante.nombreCompleto
          .trim()
          .replace(/\s+/g, ' ')
          .toUpperCase(),
        asignaturas: estudiante.asignaturas.map((asignatura) => ({
          codigo: asignatura.codigo.trim(),
          nombre: asignatura.nombre.trim().replace(/\s+/g, ' '),
          nota: asignatura.nota,
        })),
      };
      return validarEstudiante(limpio);
    });
  }

  toggleSeleccion(id: number, valor: boolean): void {
    const estudiante = this.estudiantes.find((e) => e.id === id);
    if (estudiante) {
      estudiante.seleccionado = valor;
    }
  }

  toggleSeleccionTodos(valor: boolean): void {
    this.estudiantes.forEach((e) => (e.seleccionado = valor));
  }

  seleccionarValidos(): void {
    this.estudiantes.forEach(
      (e) => (e.seleccionado = e.estado === 'valido'),
    );
  }

  actualizarConfig(patch: Partial<ActaConfig>): void {
    this.config = { ...this.config, ...patch };
    this.folioActual = this.config.folioInicial;
  }

  obtenerPorId(id: number): Estudiante | undefined {
    return this.estudiantes.find((e) => e.id === id);
  }

  guardarEdicion(edicion: EdicionEstudiante): Estudiante | undefined {
    const estudiante = this.obtenerPorId(edicion.id);
    if (!estudiante) {
      return undefined;
    }

    estudiante.universidad = edicion.universidad.trim().replace(/\s+/g, ' ');
    estudiante.nombreCompleto = edicion.nombreCompleto
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();
    estudiante.documento = edicion.documento.trim();
    estudiante.asignaturas = edicion.asignaturas
      .map((asignatura) => ({
        codigo: (asignatura.codigo ?? '').trim(),
        nombre: (asignatura.nombre ?? '').trim().replace(/\s+/g, ' '),
        nota: asignatura.nota ?? null,
      }))
      .filter(
        (asignatura) =>
          asignatura.codigo || asignatura.nombre || asignatura.nota !== null,
      );

    validarEstudiante(estudiante);
    if (estudiante.estado === 'valido') {
      estudiante.seleccionado = true;
    }
    return estudiante;
  }
}
