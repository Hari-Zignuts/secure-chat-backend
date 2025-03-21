import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseMessages } from 'src/common/constants/response-messages';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { isEmail, isUUID } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOneByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(ResponseMessages.USER.EMAIL_ALREADY_EXISTS);
    }
    const salt: string = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = this.usersRepository.createUser(dto, hashedPassword);
    return this.usersRepository.saveUser(newUser);
  }

  async getOneByEmail(email: string): Promise<User | null> {
    if (!email || !isEmail(email)) {
      return null;
    }
    return await this.usersRepository.findOneByEmail(email);
  }

  async findOneById(id: string): Promise<User | null> {
    if (!id || !isUUID(id)) {
      return null;
    }
    return await this.usersRepository.findOneById(id);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async toggleOnlineStatus(userId: string) {
    const user = await this.findOneById(userId);
    if (!user) {
      return null;
    }
    user.isOnline = user.isOnline ? false : true;
    return await this.usersRepository.saveUser(user);
  }
}
