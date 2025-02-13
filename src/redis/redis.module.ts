import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { REDIS_PUBSUB_CLIENT, REDIS_CACHE_CLIENT } from './redis.constants';
import { createRedisClient } from './redis.config';
import { redisCacheOptions } from './redis.options';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        redisCacheOptions(configService),
    }),
  ],
  providers: [
    RedisService,
    {
      provide: REDIS_PUBSUB_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createRedisClient(configService, 'RedisPubSub'),
    },
    {
      provide: REDIS_CACHE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createRedisClient(configService, 'RedisCache'),
    },
  ],
  exports: [RedisService, REDIS_PUBSUB_CLIENT, REDIS_CACHE_CLIENT, CacheModule],
})
export class RedisModule {}
