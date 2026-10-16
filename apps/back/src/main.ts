import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const globalPrefix = config.get<string>('API_PREFIX') ?? 'api';
  const port = Number(config.get<string>('PORT') ?? 3000);
  const corsOrigins = config.get<string>('CORS_ORIGINS') ?? '*';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin:
      corsOrigins === '*'
        ? true
        : corsOrigins.split(',').map((origin) => origin.trim()),
  });

  await app.listen(port, '0.0.0.0');

  Logger.log(
    `🚀 CertiSmart API running on http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`🌐 CORS origins: ${corsOrigins}`);
}

bootstrap();
