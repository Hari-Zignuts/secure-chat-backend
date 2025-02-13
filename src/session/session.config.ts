import { Injectable, Inject } from '@nestjs/common';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { REDIS_CACHE_CLIENT } from '../redis/redis.constants';
import * as connectRedis from 'connect-redis';
import { RedisClientType } from 'redis';

@Injectable()
export class SessionConfig {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CACHE_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  getSessionOptions(): session.SessionOptions {
    const RedisStore = connectRedis(session);
    return {
      store: new RedisStore({ client: this.redisClient }),
      secret:
        this.configService.get<string>('SESSION_SECRET') || 'super-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite:
          this.configService.get<string>('NODE_ENV') === 'production'
            ? 'strict'
            : 'lax',
      },
    };
  }
}
