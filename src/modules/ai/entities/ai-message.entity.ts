import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { AIConversation } from './ai-conversation.entity';

@Entity()
export class AIMessage {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => AIConversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation: AIConversation;

  @Column()
  role: 'user' | 'assistant' | 'system';

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
