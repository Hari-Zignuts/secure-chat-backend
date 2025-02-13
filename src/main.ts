import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SessionService } from './session/session.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Apply session middleware
  const sessionService = app.get(SessionService);
  app.use(sessionService.getSessionMiddleware());

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Secure Chat API') // Set API title
    .setDescription('API documentation for Secure Chat backend') // API Description
    .setVersion('1.0') // API Version
    .addBearerAuth() // Enable JWT Authentication in Swagger
    .build();

  // Create and apply Swagger module
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3000;
  logger.log(`🌍 Server running on port ${port}`);

  await app.listen(port);
}
void bootstrap();
