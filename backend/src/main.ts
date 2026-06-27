import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://localhost:5174',
      'https://192.168.2.138:5174',
      'http://localhost:5174',
      'http://192.168.2.138:5174',
    ],
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
