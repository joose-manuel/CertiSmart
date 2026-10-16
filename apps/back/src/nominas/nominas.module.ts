import { Module } from '@nestjs/common';
import { NominasController } from './nominas.controller';
import { NominasService } from './nominas.service';

@Module({
  controllers: [NominasController],
  providers: [NominasService],
})
export class NominasModule {}
