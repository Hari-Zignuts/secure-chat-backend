import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    private usersService: UsersService,
  ) {}

  async saveMessage(senderId: string, receiverId: string, message: string) {
    const sender = await this.usersService.findOneById(senderId);
    const receiver = await this.usersService.findOneById(receiverId);
    if (!sender || !receiver) {
      return;
    }
    // Find or create conversation
    let conversation = await this.conversationRepo.findOne({
      where: [
        { user1: { id: senderId }, user2: { id: receiverId } },
        { user1: { id: receiverId }, user2: { id: senderId } },
      ],
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        user1: sender,
        user2: receiver,
        lastMessageAt: new Date(),
      });
      await this.conversationRepo.save(conversation);
    }

    const newMessage = this.messageRepo.create({
      conversation,
      sender,
      message,
    });

    const chat = await this.messageRepo.save(newMessage);
    await this.conversationRepo.update(conversation.id, {
      lastMessageAt: new Date(),
    });
    return chat;
  }

  async getConversations(userId: string) {
    const conversations = await this.conversationRepo.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2'],
      order: { lastMessageAt: 'DESC' },
    });
    return conversations.map((conversation) => {
      const user =
        conversation.user1.id === userId
          ? conversation.user2
          : conversation.user1;
      const id = conversation.id;
      const lastMessageAt = conversation.lastMessageAt;
      return { id, lastMessageAt, user };
    });
  }

  async getConversionById(conversationId: string) {
    return await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['user1', 'user2'],
    });
  }

  async getOldMessages(conversationId: string) {
    return await this.messageRepo.find({
      where: {
        conversation: { id: conversationId },
      },
      relations: ['sender', 'conversation'],
      order: { createdAt: 'ASC' },
    });
  }
}
