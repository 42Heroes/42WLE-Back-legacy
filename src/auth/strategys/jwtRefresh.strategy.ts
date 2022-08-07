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

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
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
    const user = await this.userService.getOneUser(payload.id);

    try {
      const isMatch = await bcrypt.compare(
        req.cookies['refresh-token'],
        user.rt,
      );
      if (!isMatch) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new BadRequestException();
    }

    return user;
  }
}
