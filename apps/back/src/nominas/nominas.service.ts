import { BadRequestException, Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import {
  COLUMNAS_ESPERADAS,
  MAX_ESTUDIANTES_LOTE,
} from '../common/constants/constancia.constants';
import {
  Asignatura,
  calcularResumen,
  Estudiante,
  ResumenValidacion,
  validarEstudiante,
} from '../common/models/estudiante.model';

export interface ResultadoNomina {
  resumen: ResumenValidacion;
  estudiantes: Estudiante[];
}

interface BloqueColumnas {
  codigo: number;
  nombre: number;
  nota: number;
}

interface MapaColumnas {
  encabezado: number;
  universidad: number;
  documento: number;
  nombre: number;
  bloques: BloqueColumnas[];
}

interface NotaLeida {
  valor: number | null;
  invalida: boolean;
}

@Injectable()
export class NominasService {
  /**
   * Lee el Excel «cargue notas» (hoja 1) y devuelve los estudiantes con su
   * validación, en el mismo formato que espera el front.
   */
  async parsear(buffer: Buffer): Promise<ResultadoNomina> {
    const workbook = new Workbook();
    try {
      await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
    } catch {
      throw new BadRequestException({
        codigo: 'ARCHIVO_ILEGIBLE',
        message:
          'No se pudo leer el archivo. Verifica que sea un Excel .xlsx válido y que no esté protegido con contraseña.',
      });
    }

    const hoja = workbook.worksheets[0];
    if (!hoja) {
      throw new BadRequestException({
        codigo: 'SIN_HOJAS',
        message: 'El archivo no contiene ninguna hoja de cálculo.',
      });
    }

    const mapa = this.detectarColumnas(hoja);
    const estudiantes: Estudiante[] = [];

    for (let fila = mapa.encabezado + 1; fila <= hoja.rowCount; fila++) {
      const row = hoja.getRow(fila);

      const universidad = this.textoCelda(row, mapa.universidad).trim();
      const documento = this.textoCelda(row, mapa.documento).trim();
      const nombreCompleto = this.textoCelda(row, mapa.nombre).trim();

      const asignaturas: Asignatura[] = [];
      let notaInvalida = false;

      for (const bloque of mapa.bloques) {
        const codigo = this.textoCelda(row, bloque.codigo).trim();
        const nombre = this.textoCelda(row, bloque.nombre).trim();
        const { valor, invalida } = this.notaDeCelda(row, bloque.nota);
        if (invalida) {
          notaInvalida = true;
        }
        if (codigo || nombre || valor !== null || invalida) {
          asignaturas.push({ codigo, nombre, nota: valor });
        }
      }

      const filaVacia =
        !universidad &&
        !documento &&
        !nombreCompleto &&
        asignaturas.length === 0;
      if (filaVacia) {
        continue;
      }

      // Filas al pie del archivo (notas aclaratorias) no identifican a nadie:
      // sin documento ni nombre se descartan.
      if (!documento && !nombreCompleto) {
        continue;
      }

      const estudiante = validarEstudiante({
        id: estudiantes.length + 1,
        universidad,
        documento,
        nombreCompleto,
        asignaturas,
        estado: 'valido',
        errores: [],
      });

      if (
        notaInvalida &&
        !estudiante.errores.includes('NOTA_NO_NUMERICA')
      ) {
        estudiante.errores.push('NOTA_NO_NUMERICA');
        estudiante.estado = 'error';
      }

      estudiantes.push(estudiante);

      if (estudiantes.length > MAX_ESTUDIANTES_LOTE) {
        throw new BadRequestException({
          codigo: 'LIMITE_EXCEDIDO',
          message: `El archivo supera el máximo de ${MAX_ESTUDIANTES_LOTE} estudiantes por lote. Divídelo en varios archivos.`,
        });
      }
    }

    if (estudiantes.length === 0) {
      throw new BadRequestException({
        codigo: 'SIN_FILAS',
        message:
          'No se encontraron estudiantes en el archivo. Descarga la plantilla oficial y verifica los encabezados y las filas.',
      });
    }

    return { resumen: calcularResumen(estudiantes), estudiantes };
  }

  /** Genera el Excel oficial en blanco (encabezados + fila de ejemplo). */
  async plantilla(): Promise<Buffer> {
    const workbook = new Workbook();

    const hoja = workbook.addWorksheet('NOTAS MOVILIDAD');
    const anchos = [18, 14, 34, 24, 34, 9, 24, 34, 9, 24, 34, 9];
    hoja.columns = anchos.map((width) => ({ width }));

    const encabezado = hoja.addRow(COLUMNAS_ESPERADAS);
    encabezado.font = {
      bold: true,
      size: 10,
      color: { argb: 'FFFFFFFF' },
    };
    encabezado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' },
    };
    encabezado.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    encabezado.height = 30;

    hoja.views = [{ state: 'frozen', ySplit: 1 }];

    const ejemplo = hoja.addRow([
      'SANTIAGO DE CALI',
      '1234567890',
      'EJEMPLO ESTUDIANTE DE PRUEBA',
      'ASG101',
      'ASIGNATURA DE EJEMPLO 1',
      4.5,
      'ASG102',
      'ASIGNATURA DE EJEMPLO 2',
      4.0,
      '',
      '',
      '',
    ]);
    ejemplo.font = { italic: true, color: { argb: 'FF6B7280' } };

    const guia = workbook.addWorksheet('INSTRUCCIONES');
    guia.columns = [{ width: 110 }];
    const lineas = [
      'Cómo usar esta plantilla',
      '',
      '1. Diligencia una fila por estudiante: UNIVERSIDAD, CC y NOMBRE ESTUDIANTE son obligatorios.',
      '2. Completa hasta 3 bloques de asignatura (CÓDIGO · NOMBRE · NOTA). La NOTA debe estar entre 0 y 5 (puede quedar vacía si está pendiente).',
      '3. La fila de ejemplo se puede borrar antes de cargar el archivo.',
      '4. Guarda el archivo en formato .xlsx (no lo cambies a .xls ni a PDF).',
      '5. La universidad se escribe como en el acta: SANTIAGO DE CALI, DEL NORTE, NACIONAL, etc.',
      '',
      'Al subirlo en CertiSmart podrás revisar y corregir cada registro antes de generar las constancias.',
    ];
    for (const linea of lineas) {
      guia.addRow([linea]);
    }
    guia.getRow(1).font = { bold: true, size: 14 };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as unknown as Uint8Array);
  }

  // ------------------------------------------------------------------
  // Detección de columnas
  // ------------------------------------------------------------------

  private detectarColumnas(
    hoja: import('exceljs').Worksheet,
  ): MapaColumnas {
    const limiteFilas = Math.min(12, hoja.rowCount);
    let filaEncabezado = -1;
    let etiquetas: string[] = [];

    for (let fila = 1; fila <= limiteFilas; fila++) {
      const row = hoja.getRow(fila);
      const valores: string[] = [];
      for (let col = 1; col <= hoja.columnCount; col++) {
        valores.push(this.normalizar(this.textoCelda(row, col)));
      }
      const tieneUniversidad = valores.some((v) => v.includes('UNIVERSIDAD'));
      const tieneEstudiante = valores.some(
        (v) =>
          v === 'CC' ||
          v.includes('CEDULA') ||
          v.includes('DOCUMENTO') ||
          v.includes('NOMBRE'),
      );
      if (tieneUniversidad && tieneEstudiante) {
        filaEncabezado = fila;
        etiquetas = valores;
        break;
      }
    }

    if (filaEncabezado === -1) {
      throw new BadRequestException({
        codigo: 'NOMINA_INVALIDA',
        message:
          'No se reconoce el encabezado del archivo. Usa la plantilla oficial con las columnas UNIVERSIDAD, CC y NOMBRE ESTUDIANTE.',
      });
    }

    const buscar = (
      predicado: (etiqueta: string) => boolean,
    ): number => {
      const indice = etiquetas.findIndex(predicado);
      return indice === -1 ? -1 : indice + 1;
    };

    const universidad = buscar((v) => v.includes('UNIVERSIDAD'));
    const documento = buscar(
      (v) => v === 'CC' || v.includes('CEDULA') || v.includes('DOCUMENTO'),
    );
    const nombre =
      buscar((v) => v.includes('NOMBRE') && v.includes('ESTUDIANTE')) !== -1
        ? buscar((v) => v.includes('NOMBRE') && v.includes('ESTUDIANTE'))
        : buscar((v) => v.includes('NOMBRE') && !v.includes('ASIGNATURA'));

    const faltantes: string[] = [];
    if (universidad === -1) faltantes.push('UNIVERSIDAD');
    if (documento === -1) faltantes.push('CC');
    if (nombre === -1) faltantes.push('NOMBRE ESTUDIANTE');

    const bloques: BloqueColumnas[] = [];
    for (let bloque = 1; bloque <= 3; bloque++) {
      const marca = ` ${bloque}`;

      // El archivo real repite «CÓDIGO DE ASIGNATURA / NOMBRE ASIGNATURA /
      // NOTA» sin sufijo numérico; la plantilla de CertiSmart los numera.
      // Primero se intenta por sufijo y, si no existe, por orden de aparición.
      const codigos = this.ocurrencias(
        etiquetas,
        (v) => v.includes('ASIGNATURA') && v.includes('CODIGO'),
      );
      const nombres = this.ocurrencias(
        etiquetas,
        (v) =>
          v.includes('ASIGNATURA') && v.includes('NOMBRE') && !v.includes('CODIGO'),
      );
      const notas = this.ocurrencias(etiquetas, (v) => v.split(' ')[0] === 'NOTA');

      const codigoPorMarca = buscar(
        (v) =>
          v.includes('ASIGNATURA') && v.includes('CODIGO') && v.endsWith(marca),
      );
      const nombrePorMarca = buscar(
        (v) =>
          v.includes('ASIGNATURA') &&
          v.includes('NOMBRE') &&
          !v.includes('CODIGO') &&
          v.endsWith(marca),
      );
      const notaPorMarca = buscar(
        (v) => v.split(' ')[0] === 'NOTA' && v.endsWith(marca),
      );

      const codigo = codigoPorMarca !== -1 ? codigoPorMarca : (codigos[bloque - 1] ?? -1);
      const nombreAsignatura =
        nombrePorMarca !== -1 ? nombrePorMarca : (nombres[bloque - 1] ?? -1);
      const nota = notaPorMarca !== -1 ? notaPorMarca : (notas[bloque - 1] ?? -1);

      if (codigo === -1) faltantes.push(`CÓDIGO DE ASIGNATURA ${bloque}`);
      if (nombreAsignatura === -1) faltantes.push(`NOMBRE ASIGNATURA ${bloque}`);
      if (nota === -1) faltantes.push(`NOTA ${bloque}`);

      bloques.push({ codigo, nombre: nombreAsignatura, nota });
    }

    if (faltantes.length > 0) {
      throw new BadRequestException({
        codigo: 'NOMINA_INVALIDA',
        message: `Faltan columnas obligatorias en el archivo: ${faltantes.join(
          ', ',
        )}. Descarga la plantilla oficial de CertiSmart.`,
      });
    }

    return { encabezado: filaEncabezado, universidad, documento, nombre, bloques };
  }

  // ------------------------------------------------------------------
  // Lectura de celdas
  // ------------------------------------------------------------------

  private normalizar(valor: string): string {
    return (valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Índices (1-based) de todas las columnas cuya etiqueta cumple el filtro. */
  private ocurrencias(
    etiquetas: string[],
    predicado: (etiqueta: string) => boolean,
  ): number[] {
    const indices: number[] = [];
    etiquetas.forEach((etiqueta, posicion) => {
      if (predicado(etiqueta)) {
        indices.push(posicion + 1);
      }
    });
    return indices;
  }

  private textoCelda(
    row: import('exceljs').Row,
    columna: number,
  ): string {
    if (columna === -1) {
      return '';
    }
    const valor = row.getCell(columna).value;
    return this.valorATexto(valor);
  }

  private valorATexto(valor: unknown): string {
    if (valor === null || valor === undefined) {
      return '';
    }
    if (typeof valor === 'string') {
      return valor;
    }
    if (typeof valor === 'number') {
      return Number.isInteger(valor)
        ? valor.toFixed(0)
        : String(valor);
    }
    if (typeof valor === 'boolean') {
      return valor ? 'TRUE' : 'FALSE';
    }
    if (valor instanceof Date) {
      return valor.toISOString().slice(0, 10);
    }
    if (typeof valor === 'object') {
      const objeto = valor as {
        richText?: { text: string }[];
        text?: unknown;
        result?: unknown;
        error?: unknown;
      };
      if (Array.isArray(objeto.richText)) {
        return objeto.richText.map((parte) => parte.text).join('');
      }
      if (typeof objeto.text === 'string') {
        return objeto.text;
      }
      if (objeto.result !== undefined) {
        return this.valorATexto(objeto.result);
      }
      if (objeto.error !== undefined) {
        return '';
      }
    }
    return '';
  }

  private notaDeCelda(
    row: import('exceljs').Row,
    columna: number,
  ): NotaLeida {
    const valor = columna === -1 ? null : row.getCell(columna).value;

    if (valor === null || valor === undefined || valor === '') {
      return { valor: null, invalida: false };
    }

    if (typeof valor === 'number') {
      return Number.isFinite(valor)
        ? { valor, invalida: false }
        : { valor: null, invalida: true };
    }

    const texto = this.valorATexto(valor).trim().replace(',', '.');
    if (!texto) {
      return { valor: null, invalida: false };
    }

    const numero = Number(texto);
    if (Number.isNaN(numero)) {
      return { valor: null, invalida: true };
    }
    return { valor: numero, invalida: false };
  }
}
