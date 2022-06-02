import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cookieExtractor } from './cookieExtractor';
import { AuthService } from './auth.service';

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      passReqToCallback: true,
      secretOrKey: config.get<string>('JWT_RT_SECRET'),
    });
  }
  validate(req: Request, payload: any) {
    const refreshToken = req.get('');
  }
}
