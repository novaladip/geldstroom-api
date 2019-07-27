import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(serverConfig.port);
}
bootstrap();
