import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  private activeUsers = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private readonly userService: UsersService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      senderId,
      receiverId,
      message,
    }: { senderId: string; receiverId: string; message: string },
  ) {
    console.log(senderId, receiverId, message, client.handshake.query.userId);
    if (senderId !== (client.handshake.query.userId as string)) {
      return;
    }
    const sender = await this.userService.findOneById(senderId);
    if (!sender) {
      return;
    }
    const receiver = await this.userService.findOneById(receiverId);
    if (!receiver) {
      return;
    }

    const { chat, isNewConversation } = await this.chatService.saveMessage(
      sender,
      receiver,
      message,
    );
    if (this.activeUsers.has(receiverId)) {
      const receiverSocketId = this.activeUsers.get(receiverId);
      if (!receiverSocketId) {
        return;
      }
      if (isNewConversation) {
        const newConversation = {
          id: chat.conversation.id,
          user: sender,
          lastMessageAt: chat.conversation.lastMessageAt,
        };
        this.server
          .to(receiverSocketId)
          .emit('newConversation', newConversation);
      }
      this.server.to(receiverSocketId).emit('receiveMessage', chat);
    }
  }

  // Handle new connections
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, client.id);
    }
    console.log(`User connected: ${userId} (Socket ID: ${client.id})`);
  }

  // Handle disconnections
  handleDisconnect(client: Socket) {
    const userId = [...this.activeUsers.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.activeUsers.delete(userId);
    }
    console.log(`User disconnected: ${userId} (Socket ID: ${client.id})`);
  }
}
