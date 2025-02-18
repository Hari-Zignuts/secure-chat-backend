import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { SessionConfig } from './session.config';
import { SessionService } from './session.service';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [SessionConfig, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
