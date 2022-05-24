// import { Strategy } from 'passport-local';
import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
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
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        username: 'login',
        displayName: 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        profileUrl: 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image_url',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done,
  ): Promise<any> {
    const { login } = profile._json;
    console.log(profile._json);
    const user = this.authService.validateUser(login);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
