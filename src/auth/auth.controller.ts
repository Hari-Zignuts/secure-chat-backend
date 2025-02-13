import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user-dto';
import { ApiResponseType } from 'src/common/interfaces/api-response.interface';
import { ResponseMessages } from 'src/common/constants/response-messages';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseMessages.AUTH.REGISTER_SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ResponseMessages.USER.EMAIL_ALREADY_EXISTS,
  })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({ type: CreateUserDto })
  @Post('signup')
  async signup(
    @Body() dto: CreateUserDto,
  ): Promise<ApiResponseType<{ token: string }>> {
    const token = await this.authService.getSignupToken(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: ResponseMessages.AUTH.REGISTER_SUCCESS,
      data: {
        token,
      },
    };
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseMessages.AUTH.LOGIN_SUCCESS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ResponseMessages.AUTH.INVALID_CREDENTIALS,
  })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
  ): Promise<ApiResponseType<{ token: string }>> {
    const token = await this.authService.getLoginToken(dto);
    return {
      statusCode: HttpStatus.OK,
      message: ResponseMessages.AUTH.LOGIN_SUCCESS,
      data: {
        token,
      },
    };
  }
}
