import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookie from '@fastify/cookie';
import * as crypto from 'crypto';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SessionService } from './modules/session/session.service';
import { NextFunction, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://next.harimalam.in'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.use((req: Response, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // If using SharedArrayBuffer
    next();
  });

  await app.register(cookie, {
    secret:
      configService.get('COOKIE_SECRET') ||
      crypto.randomBytes(32).toString('base64'),
  });

  // Apply session middleware
  const sessionService = app.get(SessionService);
  app.use(sessionService.getSessionMiddleware());

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for the e-commerce backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create and apply Swagger module
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3000;
  logger.log(`🌍 Server running on port ${port}`);

  await app.listen(port);
}
void bootstrap();
