// 📂 auth/strategies/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { PayloadType } from 'src/common/interfaces/payload.interface';
import { ResponseMessages } from '../constants/response-messages';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest): string | null => {
          return request.cookies?.refresh_token ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_SECRET || 'refresh_secret',
    });
  }

  validate(payload: PayloadType): PayloadType {
    if (!payload) {
      throw new UnauthorizedException(
        ResponseMessages.AUTH.INVALID_REFRESH_TOKEN,
      );
    }
    return payload;
  }
}
