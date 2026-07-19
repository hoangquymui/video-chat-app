import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL')?.split(',') ?? [
      'https://localhost:5174',
      'https://192.168.2.138:5174',
      'http://localhost:5174',
      'http://192.168.2.138:5174',
    ],
    credentials: true,
  });

  await app.listen(config.get<number>('PORT') ?? 3000, '0.0.0.0');
}

bootstrap();
