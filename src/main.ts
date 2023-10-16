import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const server = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  server.enableCors();
  server.setGlobalPrefix('api');
  server.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  server.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await server.listen(process.env.PORT);
}
bootstrap();
