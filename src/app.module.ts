import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './encryption/encryption.module';
import { SessionModule } from './session/session.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
