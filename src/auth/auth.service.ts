import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async fortyTwoLogin(req) {
    const { intra_id } = req;
    const user = await this.userService.getOneUser(intra_id);
    if (!user) {
      throw new UnauthorizedException('이거 문제 있음');
    }
    const payload = {
      intra_id: user.intra_id,
      nickname: user.nickname,
      id: user.id,
    };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUser(intra_id: string) {
    const user = await this.userService.getOneUser(intra_id);
    if (!user) {
      return null;
    }
    return user;
  }
}
