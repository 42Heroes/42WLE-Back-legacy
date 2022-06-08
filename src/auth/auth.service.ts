import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { FortyTwoDto } from './dto/fortyTwo.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async fortyTwoLogin(fortyTwoDto: FortyTwoDto) {
    const { login: intra_id, campus, image_url } = fortyTwoDto;

    let user = await this.userService.isUser(intra_id);

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

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async validateUser(intra_id: string) {
    const user = await this.userService.isUser(intra_id);
    if (!user) {
      return null;
    }
    return user;
  }
}
