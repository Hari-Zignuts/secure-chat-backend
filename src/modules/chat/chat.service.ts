import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Conversation } from './conversation.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    private usersService: UsersService,
  ) {}

  async saveMessage(
    sender: User,
    receiver: User,
    message: string,
  ): Promise<Message> {
    // Find or create conversation
    let conversation = await this.conversationRepo.findOne({
      where: [
        { user1: { id: sender.id }, user2: { id: receiver.id } },
        { user1: { id: receiver.id }, user2: { id: sender.id } },
      ],
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        user1: sender,
        user2: receiver,
        lastMessageAt: new Date().toISOString(),
        lastMessage: message,
      });
      await this.conversationRepo.save(conversation);
    }
    const newMessage = this.messageRepo.create({
      conversation,
      sender,
      message,
      createdAt: new Date().toISOString(),
    });

    const chat = await this.messageRepo.save(newMessage);
    await this.conversationRepo.update(conversation.id, {
      lastMessageAt: new Date().toISOString(),
      lastMessage: message,
    });
    return chat;
  }

  async getConversations(userId: string) {
    if (!userId || !isUUID(userId)) {
      return null;
    }
    const conversations = await this.conversationRepo.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      relations: ['user1', 'user2'],
    });
    return conversations.map((conversation) => {
      const user =
        conversation.user1.id === userId
          ? conversation.user2
          : conversation.user1;
      const id = conversation.id;
      const lastMessageAt = conversation.lastMessageAt;
      return { id, lastMessageAt, user, lastMessage: conversation.lastMessage };
    });
  }

  async getConversionById(conversationId: string) {
    if (!conversationId || !isUUID(conversationId)) {
      return null;
    }
    return await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['user1', 'user2'],
    });
  }

  async getOldMessages(conversationId: string) {
    if (!conversationId || !isUUID(conversationId)) {
      return null;
    }
    return await this.messageRepo.find({
      where: {
        conversation: { id: conversationId },
      },
      relations: ['sender', 'conversation'],
      order: { createdAt: 'ASC' },
    });
  }
}
