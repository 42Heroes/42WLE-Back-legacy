import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // TODO: invalid token error handling 필요합니닷

    if (err || !user) {
      throw new HttpException('토큰 교환 중 문제가 발생했습니다.', err.status);
    }
    return user;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
}
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
}

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> | any {
    const socket = context.getArgByIndex(0);
    if (!socket.data.authenticate) {
      return false;
    } else {
      return true;
    }
  }
}
