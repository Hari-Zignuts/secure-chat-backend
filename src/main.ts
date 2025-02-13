import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
import { SessionService } from './session/session.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Apply session middleware
  const sessionService = app.get(SessionService);
  app.use(sessionService.getSessionMiddleware());

  const port = configService.get('PORT') || 3000;
  logger.log(`🌍 Server running on port ${port}`);

  await app.listen(port);
}
void bootstrap();
