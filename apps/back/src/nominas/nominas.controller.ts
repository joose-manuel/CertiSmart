import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { MAX_ARCHIVO_MB } from '../common/constants/constancia.constants';
import { NominasService, ResultadoNomina } from './nominas.service';

/** Archivo recibido por multer (memoria): no se guarda en disco. */
interface ArchivoSubido {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller()
export class NominasController {
  constructor(private readonly nominas: NominasService) {}

  /** Plantilla oficial en Excel (.xlsx) lista para diligenciar. */
  @Get('plantilla')
  async plantilla(@Res() res: Response): Promise<void> {
    const buffer = await this.nominas.plantilla();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Plantilla_Notas_Movilidad.xlsx"',
    );
    res.setHeader('X-Nombre-Archivo', 'Plantilla_Notas_Movilidad.xlsx');
    res.send(buffer);
  }

  /** Lee la nómina de estudiantes del Excel y devuelve el JSON validado. */
  @Post('nominas/parsear')
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: { fileSize: MAX_ARCHIVO_MB * 1024 * 1024 },
    }),
  )
  async parsear(
    @UploadedFile() archivo?: ArchivoSubido,
  ): Promise<ResultadoNomina> {
    if (!archivo) {
      throw new BadRequestException({
        codigo: 'ARCHIVO_REQUERIDO',
        message:
          'Adjunta el archivo Excel de notas (.xlsx) en el campo "archivo".',
      });
    }
    if (!/\.xlsx$/i.test(archivo.originalname)) {
      throw new BadRequestException({
        codigo: 'FORMATO_INVALIDO',
        message: 'Formato no permitido. Sube un archivo Excel .xlsx.',
      });
    }
    if (archivo.size > MAX_ARCHIVO_MB * 1024 * 1024) {
      throw new BadRequestException({
        codigo: 'ARCHIVO_MUY_GRANDE',
        message: `El archivo supera el tamaño máximo de ${MAX_ARCHIVO_MB} MB.`,
      });
    }

    return this.nominas.parsear(archivo.buffer);
  }
}
