import { Module } from '@nestjs/common';
import { ActasController } from './actas.controller';
import { ActasService } from './actas.service';
import { PdfService } from './pdf.service';

@Module({
  controllers: [ActasController],
  providers: [ActasService, PdfService],
})
export class ActasModule {}
