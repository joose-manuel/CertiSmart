import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

const CABECERAS_EXPUESTAS = [
  'Content-Disposition',
  'X-Nombre-Archivo',
  'X-Total',
  'X-Folio-Inicial',
  'X-Folio-Final',
  'X-Hash-Lote',
];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const globalPrefix = config.get<string>('API_PREFIX') ?? 'api';
  const port = Number(config.get<string>('PORT') ?? 3000);
  const corsOrigins = config.get<string>('CORS_ORIGINS') ?? '*';

  // Permite el origen real en Vercel (producción o previews *.vercel.app),
  // además de los orígenes explícitos definidos en CORS_ORIGINS.
  const allowedOrigins =
    corsOrigins === '*'
      ? ['*']
      : corsOrigins.split(',').map((origin) => origin.trim());

  const originIsAllowed = (origin: string | undefined): boolean => {
    if (corsOrigins === '*') {
      return true;
    }
    if (!origin) {
      return true;
    }
    if (allowedOrigins.includes(origin)) {
      return true;
    }
    // Previews/deployments de Vercel con permutación de hostname.
    return /\.vercel\.app$/i.test(origin);
  };

  // Un lote de hasta 2000 constancias viaja como JSON: subimos el límite.
  app.useBodyParser('json', { limit: '25mb' });
  app.useBodyParser('urlencoded', { limit: '25mb', extended: true });

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, originIsAllowed(origin));
    },
    exposedHeaders: CABECERAS_EXPUESTAS,
  });

  await app.listen(port, '0.0.0.0');

  Logger.log(
    `🚀 CertiSmart API running on http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`🌐 CORS origins: ${corsOrigins}`);
}

bootstrap();
