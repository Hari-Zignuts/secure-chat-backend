import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatModule } from './modules/chat/chat.module';
import { FilesModule } from './modules/files/files.module';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './modules/redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './modules/encryption/encryption.module';
import { SessionModule } from './modules/session/session.module';
import { GoogleAuthModule } from './modules/google-auth/google-auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChatModule,
    FilesModule,
    ConfigModule,
    RedisModule,
    DatabaseModule,
    EncryptionModule,
    SessionModule,
    GoogleAuthModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
