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
    console.log('in Ft');
    console.log(req);
    const { login: intra_id, campus, image_url } = req;
    let user = await this.userService.isUser(intra_id);
    console.log(user);
    if (!user) {
      const createData = {
        intra_id,
        nickname: intra_id,
        campus: campus[0].name,
        country: campus[0].country,
        image_url,
      };
      user = await this.userService.createUser(createData);
    }
    const payload = {
      intra_id: user.intra_id,
      nickname: user.nickname,
      id: user.id,
    };
    console.log(process.env.JWT_SECRET);
    const accessToken = await this.jwtService.sign(payload);
    console.log('accesssssssssssssssssssToken');
    console.log(accessToken);
    return { accessToken };
  }

  async validateUser(intra_id: string) {
    const user = await this.userService.isUser(intra_id);
    if (!user) {
      return null;
    }
    return user;
  }
}
