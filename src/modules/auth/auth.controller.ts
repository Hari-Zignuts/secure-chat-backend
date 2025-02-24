import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto';
import { ApiResponseType } from 'src/common/interfaces/api-response.interface';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<ApiResponseType<null>> {
    await this.authService.signup(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: ResponseMessages.AUTH.REGISTER_SUCCESS,
      data: null,
    };
  }

  @Post('google')
  async googleAuth(@Body() credential: { token: string }) {
    if (!credential) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ResponseMessages.AUTH.INVALID_GOOGLE_CREDENTIAL,
        data: null,
      };
    }
    console.log(credential);
    const user = await this.authService.verifyGoogleToken(credential.token);
    const token = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '7d' },
    );
    console.log(token);
    return {
      statusCode: HttpStatus.OK,
      message: ResponseMessages.AUTH.LOGIN_SUCCESS,
      data: { token },
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
  ): Promise<ApiResponseType<{ token: string }>> {
    const payload = await this.authService.verifyLogin(dto);
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      statusCode: HttpStatus.OK,
      message: ResponseMessages.AUTH.LOGIN_SUCCESS,
      data: { token },
    };
  }
}
