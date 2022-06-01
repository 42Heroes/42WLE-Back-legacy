import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('FORTYTWO_CLIENT_ID'),
      clientSecret: config.get<string>('FORTYTWO_SECRET_ID'),
      callbackURL: config.get<string>('FORTYTWO_CALLBACK_URL'),
      scope: 'public',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const userInfo = profile._json;
    return userInfo;
  }
}
