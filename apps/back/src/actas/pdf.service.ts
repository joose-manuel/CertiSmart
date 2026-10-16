import { Injectable } from '@nestjs/common';
import pdfMake = require('pdfmake');
import type {
  Column,
  Content,
  TableCell,
  TDocumentDefinitions,
  TableLayout,
} from 'pdfmake/interfaces';
import { toDataURL } from 'qrcode';
import {
  RUTA_ASSETS,
  RUTA_FIRMA,
  RUTA_FONDO,
  RUTA_FUENTES,
  RUTA_FUENTE_BOLD,
  RUTA_FUENTE_NORMAL,
  RUTA_LOGO,
  RUTA_SELLO,
} from '../common/assets';
import { PROGRAMA_ACADEMICO } from '../common/constants/constancia.constants';
import { ActaConfig, ActaDocumento } from '../common/models/acta.model';
import { nombreUniversidad, notaTexto } from '../common/utils/texto.util';

/** Bordes finos de la tabla de notas, como en la plantilla Word. */
const BORDE_TABLA: TableLayout = {
  hLineWidth: () => 0.6,
  vLineWidth: () => 0.6,
  hLineColor: () => '#000000',
  vLineColor: () => '#000000',
  paddingLeft: () => 6,
  paddingRight: () => 6,
  paddingTop: () => 4,
  paddingBottom: () => 4,
};

const ALTO_QR = 52;

/**
 * Renderiza la constancia oficial (plantilla Word de la Facultad de Salud)
 * con pdfmake usando la fuente Tinos (métricamente igual a Times New Roman).
 */
@Injectable()
export class PdfService {
  constructor() {
    pdfMake.setLocalAccessPolicy((ruta) => ruta.startsWith(RUTA_ASSETS));
    pdfMake.setUrlAccessPolicy(() => false);
    pdfMake.setFonts({
      Tinos: {
        normal: RUTA_FUENTE_NORMAL,
        bold: RUTA_FUENTE_BOLD,
      },
    });
  }

  async generar(acta: ActaDocumento, config: ActaConfig): Promise<Buffer> {
    const definicion = await this.definicion(acta, config);
    return pdfMake.createPdf(definicion).getBuffer();
  }

  private async definicion(
    acta: ActaDocumento,
    config: ActaConfig,
  ): Promise<TDocumentDefinitions> {
    const universidad = nombreUniversidad(acta.graduando.universidad) || '—';
    const documento = acta.graduando.documento || '—';
    const nombreCompleto = acta.graduando.nombreCompleto || '—';

    const qrDataUrl = config.codigoQr
      ? await toDataURL(acta.urlVerificacion, {
          margin: 0,
          width: 160,
          errorCorrectionLevel: 'M',
        })
      : '';

    const definicion: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [85, 71, 85, 71],
      defaultStyle: {
        font: 'Tinos',
        fontSize: 12,
        lineHeight: 1.2,
        color: '#000000',
      },
      background: () => ({
        image: RUTA_FONDO,
        width: 612,
        height: 792,
      }),
      header: () =>
        ({
          stack: [
            {
              columns: [
                { image: RUTA_LOGO, width: 120 },
                {
                  width: '*',
                  stack: [
                    {
                      text: 'Facultad de Salud',
                      font: 'Tinos',
                      bold: true,
                      color: '#ff0000',
                      fontSize: 11,
                      lineHeight: 1.0,
                      alignment: 'right',
                    },
                    {
                      text: 'Programa de Medicina',
                      font: 'Tinos',
                      bold: true,
                      color: '#ff0000',
                      fontSize: 11,
                      lineHeight: 1.0,
                      alignment: 'right',
                    },
                  ],
                },
              ],
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 372,
                  y2: 0,
                  lineWidth: 0.5,
                  lineColor: '#747474',
                },
              ],
              margin: [174, -5, 0, 0],
            },
          ],
          margin: [39, 35, 27, 0],
        }) as Content,
      footer: () => this.footer(acta, config, qrDataUrl),
      content: this.contenido(acta, universidad, documento, nombreCompleto),
    };

    if (config.marcaAgua) {
      definicion.watermark = {
        text: 'OFICIAL',
        opacity: 0.07,
        bold: true,
        fontSize: 76,
      };
    }

    return definicion;
  }

  /**
   * Pie de página: la franja roja va anclada al borde inferior y, cuando los
   * sellos están activos, el bloque de verificación (QR · hash) queda justo
   * encima dentro del margen, sin empujar el contenido a una segunda página.
   */
  private footer(
    acta: ActaDocumento,
    config: ActaConfig,
    qrDataUrl: string,
  ): Content {
    const contacto = [
      'Universidad del Valle',
      'Campus San Fernando',
      'Telefax: 602 3210000',
      'Conmutador: 3212100 - Ext. 4052 - 4057',
      'Correo electrónico: medicina.pregrado@correunivalle.edu.co',
      'Santiago de Cali - Colombia',
    ];

    const stack: Content[] = [];

    if (config.codigoQr || config.estampaTiempo) {
      const altura = config.codigoQr ? ALTO_QR : 17;
      stack.push({
        columns: this.pieVerificacion(acta, config, qrDataUrl),
        margin: [14, 57 - altura, 14, 0],
      });
    }

    stack.push({
      canvas: [
        {
          type: 'line',
          x1: 12,
          y1: 0,
          x2: 570,
          y2: 0,
          lineWidth: 0.5,
          lineColor: '#747474',
        },
      ],
    });

    stack.push({
      columns: [
        {
          text: 'Construyendo futuro',
          fontSize: 14,
          color: '#ADADAD',
          margin: [19, 0, 0, 0],
        },
        {
          stack: contacto.map((linea) => ({
            text: linea,
            fontSize: 6,
            lineHeight: 1.15,
            color: '#747474',
            alignment: 'right',
          })),
        },
      ],
      margin: [14, 10, 14, 0],
    });

    return { stack } as Content;
  }

  /** Columnas del pie de verificación: QR + datos y, opcionalmente, el hash. */
  private pieVerificacion(
    acta: ActaDocumento,
    config: ActaConfig,
    qrDataUrl: string,
  ): Column[] {
    const columnas: Column[] = [];

    if (config.codigoQr) {
      columnas.push({ image: qrDataUrl, width: ALTO_QR });
      columnas.push({
        stack: [
          { text: `Constancia Nº ${acta.folio}`, bold: true, fontSize: 8.5 },
          {
            text: `Verificación pública: ${acta.urlVerificacion}`,
            fontSize: 7,
            color: '#4b5563',
          },
        ],
        margin: [10, 8, 0, 0],
      });
    }

    if (config.estampaTiempo) {
      columnas.push({
        stack: [
          {
            text: `SHA-256: ${acta.hash}`,
            fontSize: 6.5,
            color: '#6b7280',
            alignment: 'right',
          },
        ],
        margin: [0, 8, 0, 0],
      });
    }

    return columnas;
  }

  private contenido(
    acta: ActaDocumento,
    universidad: string,
    documento: string,
    nombreCompleto: string,
  ): Content[] {
    const filaEstudiante: TableCell[] = [
      {
        text: `${documento} - ${nombreCompleto}`,
        colSpan: 3,
        bold: true,
        alignment: 'center',
      },
      {},
      {},
    ];

    const filaEncabezados: TableCell[] = [
      {
        text: 'CÓDIGO DE ASIGNATURA',
        bold: true,
        alignment: 'center',
        fontSize: 12,
      },
      {
        text: 'NOMBRE ASIGNATURA',
        bold: true,
        alignment: 'center',
        fontSize: 12,
      },
      {
        text: 'NOTA',
        bold: true,
        alignment: 'center',
        fontSize: 12,
      },
    ];

    const filasAsignaturas: TableCell[][] = acta.graduando.asignaturas.map(
      (asignatura) => [
        { text: asignatura.codigo || '—', alignment: 'center' },
        { text: asignatura.nombre || '—' },
        { text: notaTexto(asignatura.nota), alignment: 'center' },
      ],
    );

    return [
      { text: acta.textoFecha, margin: [0, 23, 0, 12] },

      { text: 'Señoras(es)', margin: [0, 0, 0, 2] },
      { text: universidad, bold: true, margin: [0, 0, 0, 2] },
      { text: PROGRAMA_ACADEMICO },

      { text: 'Reciban un cordial saludo', margin: [0, 14, 0, 0] },

      {
        text:
          'Me permito informar que el estudiante de último año de Medicina – ' +
          'Interno, relacionado a continuación, proveniente de la Universidad ' +
          `${universidad} realizó la rotación adjunta en nuestro escenario de ` +
          'práctica y obtuvo las siguientes notas:',
        alignment: 'justify',
        margin: [0, 14, 0, 14],
      },

      {
        table: {
          headerRows: 1,
          widths: [132.6, 265.2, 44.2],
          body: [filaEstudiante, filaEncabezados, ...filasAsignaturas],
        },
        layout: BORDE_TABLA,
      },

      {
        text:
          'Compartimos este documento para que el estudiante pueda continuar ' +
          'con su proceso de grado.',
        alignment: 'justify',
        margin: [0, 14, 0, 0],
      },

      {
        columns: [
          { text: 'Atentamente,' },
        ],
        margin: [0, 42, 0, 0],
      },
      {
        columns: [
          { image: RUTA_FIRMA, width: 56, margin: [16, 0, 0, 0] },
          { image: RUTA_SELLO, width: 100, margin: [8, -16, 0, 0] },
        ],
        margin: [0, 0, 0, 0],
      },
      { text: acta.director.nombre, bold: true, margin: [0, -10, 0, 0] },
      { text: acta.director.cargo, margin: [0, 0, 0, 0] },
    ];
  }
}
