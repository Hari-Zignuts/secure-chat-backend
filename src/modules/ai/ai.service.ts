import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AIConversation } from './entities/ai-conversation.entity';
import { Repository } from 'typeorm';
import { AIMessage } from './entities/ai-message.entity';
import { User } from '../users/user.entity';
import { AiRole } from 'src/common/enums/ai.role';
import Together from 'together-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AIConversation)
    private conversationRepo: Repository<AIConversation>,
    @InjectRepository(AIMessage)
    private messageRepo: Repository<AIMessage>,
    private configService: ConfigService,
  ) {}

  async createConversation(user: User): Promise<AIConversation> {
    const conversation = this.conversationRepo.create({ user });
    return this.conversationRepo.save(conversation);
  }

  async addMessage(
    conversation: AIConversation,
    role: AiRole,
    content: string,
  ) {
    const message = this.messageRepo.create({ conversation, role, content });
    const together = new Together({
      apiKey: this.configService.get('TOGETHER_API_KEY'),
    });

    const response = await together.chat.completions.create({
      messages: [
        {
          role: message.role,
          content: message.content,
        },
      ],
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    });
    if (
      response.choices &&
      response.choices[0] &&
      response.choices[0].message
    ) {
      const responseMessage = response.choices[0].message;
      const aiResponse = this.messageRepo.create({
        conversation: conversation,
        role: responseMessage.role as AiRole,
        content: responseMessage.content as string,
      });
      await this.messageRepo.save(message);
      await this.messageRepo.save(aiResponse);
      return aiResponse;
    } else {
      console.error('Response is missing expected properties');
      return 'Error: Response is missing expected properties';
    }
  }
}
