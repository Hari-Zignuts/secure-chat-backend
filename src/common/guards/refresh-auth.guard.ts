import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { ResponseMessages } from '../constants/response-messages';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (!request.cookies?.refresh_token) {
      throw new UnauthorizedException(ResponseMessages.AUTH.NO_REFRESH_TOKEN);
    }

    return super.canActivate(context);
  }
}
