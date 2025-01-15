import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/swagger.config';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  setupSwagger(app);

  const port = process.env.PORT || 4000;

  await app.listen(port);

  const baseUrl =
  process.env.APP_BASE_URL?.replace(/\/$/, '') ?? `http://localhost:${port}`;

  console.log(`*===>APPLICATION IS RUNNING AT : ${baseUrl}/docs`);
}
bootstrap();
