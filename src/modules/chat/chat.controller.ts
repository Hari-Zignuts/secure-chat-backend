import { Controller, Get, Param, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ReqWithPayloadType } from 'src/common/interfaces/payload.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getAllConversations(@Req() req: ReqWithPayloadType) {
    const conversations = await this.chatService.getConversations(req.user.sub);
    return conversations;
  }

  @Get('messages/:conversationId')
  async getOldMessages(
    @Param('conversationId') conversationId: string,
    @Req() req: ReqWithPayloadType,
  ) {
    const conversion = await this.chatService.getConversionById(conversationId);
    if (!conversion) {
      return null;
    }
    if (
      conversion.user1.id !== req.user.sub &&
      conversion.user2.id !== req.user.sub
    ) {
      return null;
    }
    const messages = await this.chatService.getOldMessages(conversationId);
    return messages;
  }
}
