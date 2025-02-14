import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { PayloadType } from 'src/common/interfaces/payload.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  generateTokens(payload: PayloadType): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken: string): Promise<PayloadType> {
    try {
      return this.jwtService.verify(refreshToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        ResponseMessages.AUTH.INVALID_REFRESH_TOKEN,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
