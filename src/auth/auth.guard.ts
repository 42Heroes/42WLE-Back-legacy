import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
