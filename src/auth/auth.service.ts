import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user-dto';
import * as bcrypt from 'bcrypt';
import { PayloadType } from 'src/common/interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getSignupToken(dto: CreateUserDto): Promise<string> {
    const user = await this.usersService.createUser(dto);
    const payload: PayloadType = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async getLoginToken(dto: LoginUserDto): Promise<string> {
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
    const payload: PayloadType = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
