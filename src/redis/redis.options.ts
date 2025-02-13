import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export const redisCacheOptions = (
  configService: ConfigService,
): CacheModuleOptions => ({
  store: redisStore as any,
  host: configService.get<string>('REDIS_HOST'),
  port: configService.get<number>('REDIS_PORT'),
  password: configService.get<string>('REDIS_PASSWORD') || undefined,
  ttl: 60 * 5, // Default cache expiry (5 minutes)
});
