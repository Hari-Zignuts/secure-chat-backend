import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIConversation } from './entities/ai-conversation.entity';
import { AIMessage } from './entities/ai-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AIConversation, AIMessage])],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
