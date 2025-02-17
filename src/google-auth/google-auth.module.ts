import { Module } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Module({
  providers: [
    {
      provide: 'GOOGLE_OAUTH_CLIENT',
      useFactory: () => new OAuth2Client(process.env.GOOGLE_CLIENT_ID),
    },
  ],
  exports: ['GOOGLE_OAUTH_CLIENT'],
})
export class GoogleAuthModule {}
