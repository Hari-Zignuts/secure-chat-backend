import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

/**
 * Creates a Redis client with proper logging and error handling.
 */
export const createRedisClient = (
  configService: ConfigService,
  clientType: string,
): Redis => {
  const logger = new Logger(clientType);

  const options: RedisOptions = {
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
    password: configService.get<string>('REDIS_PASSWORD') || undefined,
    retryStrategy: (times) => Math.min(times * 50, 2000), // Smooth reconnection
    reconnectOnError: (err) => {
      logger.warn(`🔄 ${clientType} reconnecting due to error: ${err.message}`);
      return true;
    },
  };

  const client = new Redis(options);

  client.on('connect', () =>
    logger.log(`🔥 ${clientType} connected successfully`),
  );
  client.on('ready', () => logger.log(`🚀 ${clientType} is ready to use`));
  client.on('error', (err) => logger.error(`❌ ${clientType} Error:`, err));
  client.on('reconnecting', () =>
    logger.warn(`🔄 ${clientType} is reconnecting...`),
  );

  return client;
};
