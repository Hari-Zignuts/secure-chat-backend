import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { PayloadType } from 'src/common/interfaces/payload.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(dto: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(dto);
    if (!user) {
      throw new InternalServerErrorException(
        ResponseMessages.AUTH.REGISTER_FAIL,
      );
    }
    return user;
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
