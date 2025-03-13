import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { LoginUserDto } from './dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { PayloadType } from 'src/common/interfaces/payload.interface';
import { OAuth2Client } from 'google-auth-library';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject('GOOGLE_OAUTH_CLIENT')
    private readonly oauthClient: OAuth2Client,
    private readonly aiService: AiService,
  ) {}

  async signup(dto: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(dto);
    await this.aiService.createConversation(user);
    if (!user) {
      throw new InternalServerErrorException(
        ResponseMessages.AUTH.REGISTER_FAIL,
      );
    }
    return user;
  }

  // Method to verify the token
  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token');
      }
      const existingUser = await this.usersService.getOneByEmail(
        payload?.email || '',
      );
      if (existingUser) {
        return existingUser;
      }
      const newUser = await this.usersService.createUser({
        email: payload?.email || '',
        name: payload?.name || '',
        avatar: payload?.picture || '',
        password: '',
      });
      await this.aiService.createConversation(newUser);
      return newUser;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  async verifyLogin(dto: LoginUserDto): Promise<PayloadType> {
    const user = await this.usersService.getOneByEmail(dto.email);
    if (!user) {
      throw new HttpException(
        ResponseMessages.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        ResponseMessages.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { email: user.email, sub: user.id };
  }
}
