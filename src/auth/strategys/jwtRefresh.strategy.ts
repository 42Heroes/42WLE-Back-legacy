import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies['refresh-token'];
        },
      ]),
      passReqToCallback: true,
      secretOrKey: config.get<string>('JWT_RT_SECRET'),
    });
  }
  async validate(req: Request, payload: any) {
    const { intra_id } = payload;

    try {
      const user = await this.userService.isUser(intra_id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const refreshToken = await this.authService.getRefreshToken(user);

      const isValid =
        refreshToken.refreshToken === req.cookies['refresh-token'];

      if (!isValid) {
        req.res.clearCookie('refresh-token');
        throw new UnauthorizedException('Invalid refresh token');
      }

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
