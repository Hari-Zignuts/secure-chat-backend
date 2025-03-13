import { User } from 'src/modules/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  JoinTable,
} from 'typeorm';
import { AIMessage } from './ai-message.entity';

@Entity()
export class AIConversation {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => User)
  @JoinTable({ name: 'user_id' })
  user: User;

  @OneToMany(() => AIMessage, (message) => message.conversation, {
    cascade: true,
  })
  messages: AIMessage[];

  @CreateDateColumn()
  createdAt: Date;
}
