import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .use(cors())
    .use(helmet())
    .use(compression());

  await app.listen(process.env.PORT || 6825);
}
bootstrap();
