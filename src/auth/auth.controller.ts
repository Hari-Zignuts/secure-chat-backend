import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { ApiResponseType } from 'src/common/interfaces/api-response.interface';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { FastifyReply, FastifyRequest } from 'fastify';
import { setRefreshTokenCookie } from 'src/common/utils/cookie.util';
import { JwtRefreshGuard } from 'src/common/guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto): Promise<ApiResponseType<null>> {
    await this.authService.signup(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: ResponseMessages.AUTH.REGISTER_SUCCESS,
      data: null,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<ApiResponseType<{ token: string }>> {
    const payload = await this.authService.verifyLogin(dto);
    const { accessToken, refreshToken } =
      this.authService.generateTokens(payload);

    setRefreshTokenCookie(reply, refreshToken);

    return {
      statusCode: HttpStatus.OK,
      message: ResponseMessages.AUTH.LOGIN_SUCCESS,
      data: { token: accessToken },
    };
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @Req() request: FastifyRequest,
  ): Promise<ApiResponseType<{ token: string }>> {
    const refreshToken: string | undefined = request.cookies?.refresh_token;

    if (!refreshToken) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'No refresh token provided',
        data: null,
      };
    }

    const payload = await this.authService.verifyRefreshToken(refreshToken);
    const newTokens = this.authService.generateTokens(payload);

    return {
      statusCode: HttpStatus.OK,
      message: ResponseMessages.AUTH.REFRESH_SUCCESS,
      data: { token: newTokens.accessToken },
    };
  }
}
