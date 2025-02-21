import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ChatGateway } from './chat.gateway';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation]), UsersModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
