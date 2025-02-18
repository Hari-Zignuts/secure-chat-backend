import { Injectable } from '@nestjs/common';
import * as session from 'express-session';
import { SessionConfig } from './session.config';

@Injectable()
export class SessionService {
  constructor(private readonly sessionConfig: SessionConfig) {}

  getSessionMiddleware() {
    return session(this.sessionConfig.getSessionOptions());
  }
}
