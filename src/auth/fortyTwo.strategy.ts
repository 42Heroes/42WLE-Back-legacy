import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID:
        'e62b1d70951c129cfe7d5cdf0e6d010df97760de2d6a4c0fc1415cfdc736a383',
      clientSecret:
        '36310cd2e0d990041233e99f535f29ee599c6e3bac3771cf50b05a2abac13465',
      callbackURL: 'http://localhost:8080/auth/42/callback',
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
