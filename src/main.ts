import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Geldstroom')
    .setDescription('The Geldstroom API documentation')
    .setVersion('0.1')
    .addBearerAuth('Authorization', 'header')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  const serverConfig = config.get('server');
  await app.listen(serverConfig.port);
}
bootstrap();
