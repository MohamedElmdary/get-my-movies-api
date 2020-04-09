import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!process.env.production) {
    app.use(cors());
  }

  app.use(helmet()).use(compression());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
