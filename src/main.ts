import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

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

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  await app.listen(process.env.PORT || serverConfig.port);
}
bootstrap();
