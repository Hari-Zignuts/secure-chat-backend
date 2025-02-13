import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    dto: CreateUserDto,
  ): Promise<{ message: string; token: string }> {
    const user = await this.usersService.createUser(dto);
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { message: ResponseMessages.AUTH.REGISTER_SUCCESS, token };
  }
}
