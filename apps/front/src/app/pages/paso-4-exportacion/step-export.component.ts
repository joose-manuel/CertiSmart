import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { InputNumberInputEvent } from 'primeng/inputnumber';

import { INSTITUCION, FOLIO_PREFIJO, FORMATO_RECOMENDADO } from '../../core/constants/actas.constants';
import {
  ActaIndice,
  FormatoNombre,
  ModoExportacion,
} from '../../core/models/acta.model';
import { ActasStoreService } from '../../core/services/actas-store.service';
import { ActasApiService } from '../../core/services/actas-api.service';
import { mensajeHttpError, descargarBlob } from '../../core/utils/descarga.util';
import {
  AYUDA_INCLUIR_INVALIDOS,
  AYUDA_PAQUETE,
  AYUDA_RANGO,
  DESCRIPCION_INDICE,
  TITULO_INDICE,
  ETIQUETA_ACTAS,
  ETIQUETA_ALCANCE,
  ETIQUETA_DESCARGAR_ZIP,
  ETIQUETA_DESDE,
  ETIQUETA_EJEMPLO,
  ETIQUETA_EXCLUIDOS,
  ETIQUETA_FORMATO,
  ETIQUETA_GENERANDO,
  ETIQUETA_GENERAR,
  ETIQUETA_HASTA,
  ETIQUETA_MODO,
  ETIQUETA_NUEVO_LOTE,
  ETIQUETA_PAQUETE,
  ETIQUETA_RECOMENDADA,
  ETIQUETA_VOLVER,
  ETIQUETAS_RESUMEN_LOTE,
  FORMATOS_DISPONIBLES,
  MODO_BASE,
  PASOS_GENERACION,
  PASO_TICK_MS,
  SUBTITULO_EXPORTACION,
  TEXTO_ALCANCE_VACIO,
  TEXTO_GENERANDO,
  TEXTO_LOTE_LISTO,
  TITULO_EXPORTACION,
  TITULO_LOTE_LISTO,
} from './step-export.constants';
import {
  EstadisticaLote,
  FaseExportacion,
  OpcionModo,
  ResumenLote,
  SolicitudSeleccion,
} from './step-export.interface';
import { StepExportService } from './step-export.service';

@Component({
  selector: 'app-step-export',
  templateUrl: './step-export.component.html',
  styleUrls: ['./step-export.component.css'],
  providers: [StepExportService],
})
export class StepExportComponent implements OnInit, OnDestroy {
  @Output() retroceder = new EventEmitter<void>();
  @Output() nuevoLote = new EventEmitter<void>();

  fase: FaseExportacion = 'revision';
  modo: ModoExportacion = 'valid';
  formato: FormatoNombre = 'documento_nombre';
  desde = 1;
  hasta = 1;
  nombrePaquete = '';
  progreso = 0;
  pasoIndice = 0;
  pasoActual = PASOS_GENERACION[0].etiqueta;
  lote: ResumenLote | null = null;
  blobLote: Blob | null = null;

  filas: ActaIndice[] = [];
  estadisticas: EstadisticaLote[] = [];
  opcionesModo: OpcionModo[] = [];
  excluidos = { invalidos: 0, fueraDeAlcance: 0 };

  readonly titulo = TITULO_EXPORTACION;
  readonly subtitulo = SUBTITULO_EXPORTACION;
  readonly tituloIndice = TITULO_INDICE;
  readonly descripcionIndice = DESCRIPCION_INDICE;
  readonly etiquetaAlcance = ETIQUETA_ALCANCE;
  readonly etiquetaModo = ETIQUETA_MODO;
  readonly etiquetaFormato = ETIQUETA_FORMATO;
  readonly etiquetaDesde = ETIQUETA_DESDE;
  readonly etiquetaHasta = ETIQUETA_HASTA;
  readonly ayudaRango = AYUDA_RANGO;
  readonly textoRangoInvalido = 'El registro «Desde» no puede superar a «Hasta».';
  readonly etiquetaPaquete = ETIQUETA_PAQUETE;
  readonly ayudaPaquete = AYUDA_PAQUETE;
  readonly etiquetaExcluidos = ETIQUETA_EXCLUIDOS;
  readonly textoAlcanceVacio = TEXTO_ALCANCE_VACIO;
  readonly textoGenerando = TEXTO_GENERANDO;
  readonly tituloLoteListo = TITULO_LOTE_LISTO;
  readonly textoLoteListo = TEXTO_LOTE_LISTO;
  readonly etiquetaDescargarZip = ETIQUETA_DESCARGAR_ZIP;
  readonly etiquetaGenerando = ETIQUETA_GENERANDO;
  readonly etiquetaNuevoLote = ETIQUETA_NUEVO_LOTE;
  readonly etiquetaRecomendada = ETIQUETA_RECOMENDADA;
  readonly etiquetaEjemplo = ETIQUETA_EJEMPLO;
  readonly etiquetaActas = ETIQUETA_ACTAS;
  readonly etiquetasLote = ETIQUETAS_RESUMEN_LOTE;
  readonly etiquetaVolver = ETIQUETA_VOLVER;
  readonly formatos = FORMATOS_DISPONIBLES;
  readonly formatoRecomendado = FORMATO_RECOMENDADO;
  readonly TEXTO_RANGO_INVALIDO = undefined;

  private temporizador?: ReturnType<typeof setInterval>;

  constructor(
    private readonly store: ActasStoreService,
    private readonly exportService: StepExportService,
    private readonly api: ActasApiService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.desde = 1;
    this.hasta = this.totalRegistros || 1;
    this.recalcular();
  }

  ngOnDestroy(): void {
    this.detenerGeneracion();
  }

  get config() {
    return this.store.configuracion;
  }

  get totalRegistros(): number {
    return this.store.lista.length;
  }

  get seleccionados(): number {
    return this.store.seleccionadosCount;
  }

  get nombreZipFinal(): string {
    const base =
      this.nombrePaquete.trim() ||
      this.exportService.nombrePaqueteSugerido();
    return this.exportService.nombreZip(base, this.config.fechaExpedicion);
  }

  get puedeGenerar(): boolean {
    return this.filas.length > 0 && this.fase !== 'generando';
  }

  get etiquetaGenerar(): string {
    if (this.fase === 'generando') {
      return ETIQUETA_GENERANDO;
    }
    const total = this.filas.length;
    return total > 0 ? `${ETIQUETA_GENERAR} (${total})` : ETIQUETA_GENERAR;
  }

  get rangoInvalido(): boolean {
    return this.desde > this.hasta;
  }

  get pasoDetalle(): string {
    const total = PASOS_GENERACION.length;
    return `Paso ${Math.min(this.pasoIndice + 1, total)} de ${total} · ${this.pasoActual}`;
  }


  onSeleccionarModo(modo: ModoExportacion): void {
    if (this.modo === modo) {
      return;
    }
    this.modo = modo;
    this.recalcular();
  }

  onChangeFormato(): void {
    this.recalcular();
  }

  onChangeAlcance(): void {
    this.recalcular();
  }

  onRangoInput(campo: 'desde' | 'hasta', evento: InputNumberInputEvent): void {
    this.aplicarRango(campo, Number(evento.value));
  }

  onRangoBlur(campo: 'desde' | 'hasta', evento: Event): void {
    this.aplicarRango(campo, Number((evento.target as HTMLInputElement).value));
  }

  async generar(): Promise<void> {
    if (!this.puedeGenerar) {
      return;
    }
    this.fase = 'generando';
    this.lote = null;
    this.blobLote = null;
    this.progreso = PASOS_GENERACION[0].porcentaje;
    this.pasoIndice = 0;
    this.pasoActual = PASOS_GENERACION[0].etiqueta;

    const estudiantes = this.filas.map((fila) => fila.estudiante);

    try {
      // Animación sincronizada con el procesamiento real del backend.
      this.detenerGeneracion();
      let tickIndex = 0;
      const tick = (resolve: () => void) => {
        const timer = setInterval(() => {
          tickIndex += 1;
          if (tickIndex >= PASOS_GENERACION.length) {
            clearInterval(timer);
            return;
          }
          this.pasoIndice = tickIndex;
          this.progreso = PASOS_GENERACION[tickIndex].porcentaje;
          this.pasoActual = PASOS_GENERACION[tickIndex].etiqueta;
        }, PASO_TICK_MS);
        this.temporizador = timer;
      };
      tick(() => {});

      const resp = await firstValueFrom(
        this.api.generar(
          estudiantes,
          this.config,
          this.formato,
          this.nombrePaquete.trim() || undefined,
        ),
      );

      this.detenerGeneracion();
      this.progreso = 100;
      this.pasoActual = PASOS_GENERACION[PASOS_GENERACION.length - 1].etiqueta;

      const blob = resp.body!;
      const enc = this.api.leerEncabezados(resp);
      const total = enc.total || this.filas.length;
      const hash = enc.hashLote;
      this.blobLote = blob;
      this.lote = {
        total,
        folioInicial: enc.folioInicial || this.exportService.folioTexto(this.config.folioInicial),
        folioFinal: enc.folioFinal || this.exportService.folioTexto(this.config.folioInicial + total - 1),
        pesoBytes: blob.size,
        pesoLegible: this.exportService.formatearPeso(blob.size),
        nombreZip: enc.nombreArchivo || this.nombreZipFinal,
        hashLote: hash,
        hashLoteCorto: this.exportService.hashCorto(hash),
        generadoEn: this.exportService.fechaHora(),
        vigenciaMin: 60,
      };

      const nombreArchivo =
        enc.nombreArchivo || this.nombreZipFinal;
      descargarBlob(blob, nombreArchivo);

      this.fase = 'listo';
      this.messageService.add({
        severity: 'success',
        summary: TITULO_LOTE_LISTO,
        detail: `${this.lote.total} constancias foliadas de ${this.lote.folioInicial} a ${this.lote.folioFinal}.`,
        life: 6000,
      });
    } catch (error) {
      this.detenerGeneracion();
      this.fase = 'revision';
      this.progreso = 0;
      const mensaje = await mensajeHttpError(error, 'No se pudo generar el lote.');
      this.messageService.add({
        severity: 'error',
        summary: 'Generación fallida',
        detail: mensaje,
        life: 10000,
      });
    }
  }

  async descargarZip(): Promise<void> {
    if (!this.blobLote) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin paquete',
        detail: 'No hay un lote generado para descargar.',
      });
      return;
    }
    const nombre = this.lote?.nombreZip || this.nombreZipFinal;
    descargarBlob(this.blobLote, nombre);
  }

  async onDescargarActa(fila: ActaIndice): Promise<void> {
    if (!fila.estudiante) {
      return;
    }
    try {
      const configIndividual = {
        ...this.config,
        folioInicial: this.config.folioInicial + (fila.numero - 1),
      };
      const resp = await firstValueFrom(
        this.api.generar([fila.estudiante], configIndividual, this.formato),
      );
      const nombre =
        resp.headers.get('X-Nombre-Archivo')?.trim() || fila.archivo;
      if (resp.body) {
        descargarBlob(resp.body, nombre);
      }
      this.messageService.add({
        severity: 'success',
        summary: fila.archivo,
        detail: 'Constancia descargada.',
        life: 4000,
      });
    } catch (error) {
      const mensaje = await mensajeHttpError(
        error,
        'No se pudo descargar la constancia.',
      );
      this.messageService.add({
        severity: 'error',
        summary: 'Descarga fallida',
        detail: mensaje,
        life: 8000,
      });
    }
  }

  onRetroceder(): void {
    this.retroceder.emit();
  }

  onNuevoLote(): void {
    this.nuevoLote.emit();
  }

  private finalizar(): void {
    // conservado por compatibilidad; no se usa tras la integración real
  }

  private detenerGeneracion(): void {
    if (this.temporizador) {
      clearInterval(this.temporizador);
      this.temporizador = undefined;
    }
  }

  private aplicarRango(campo: 'desde' | 'hasta', valor: number): void {
    if (!Number.isFinite(valor)) {
      return;
    }

    const acotado = Math.min(
      Math.max(Math.trunc(valor), 1),
      Math.max(this.totalRegistros, 1),
    );

    if (campo === 'desde' ? this.desde === acotado : this.hasta === acotado) {
      return;
    }

    if (campo === 'desde') {
      this.desde = acotado;
    } else {
      this.hasta = acotado;
    }
    this.recalcular();
  }

  private recalcular(): void {
    this.detenerGeneracion();

    const solicitud: SolicitudSeleccion = {
      modo: this.modo,
      desde: this.desde,
      hasta: this.hasta,
      incluirInvalidos: false,
    };

    this.filas = this.exportService.construirFilas(
      this.exportService.resolverSeleccion(this.store.lista, solicitud),
      this.config,
      this.formato,
      this.config.folioInicial,
    );
    this.excluidos = this.exportService.contarExcluidos(
      this.store.lista,
      solicitud,
    );
    this.opcionesModo = this.construirOpcionesModo();
    this.estadisticas = this.construirEstadisticas();
    this.fase = 'revision';
    this.lote = null;
    this.blobLote = null;
  }

  private construirOpcionesModo(): OpcionModo[] {
    const resumen = this.store.resumen;
    const conteos: Record<ModoExportacion, number> = {
      valid: resumen.validos,
      all: resumen.total,
      selected: this.seleccionados,
      range: this.totalRegistros,
    };

    return MODO_BASE.map((opcion) => ({
      ...opcion,
      label: `${opcion.label} (${conteos[opcion.value]})`,
    }));
  }

  private construirEstadisticas(): EstadisticaLote[] {
    const peso = this.exportService.formatearPeso(
      this.exportService.pesoEstimado(this.filas.length),
    );

    return [
      {
        etiqueta: 'Tamaño estimado',
        valor: peso,
        detalle: `${this.filas.length} PDF tamaño carta`,
        icono: 'pi pi-database',
        tono: 'ok',
      },
    ];
  }
}
