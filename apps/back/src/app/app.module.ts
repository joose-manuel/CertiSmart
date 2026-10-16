import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActasModule } from '../actas/actas.module';
import { NominasModule } from '../nominas/nominas.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['apps/back/.env.local', 'apps/back/.env', '.env'],
    }),
    NominasModule,
    ActasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
