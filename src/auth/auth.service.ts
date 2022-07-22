import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { FortyTwoDto } from './dto/fortyTwo.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
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

    const tokens = await this.getToken(payload);
    user.rt = await bcrypt.hash(tokens.refreshToken, 10);
    // TODO: 누군가 탈취해서 우리코드로 보내면 뚫리는거 아닌가? hash가 소용있나?
    await user.save();
    return { tokens };
  }

  async validateUser(intra_id: string) {
    const user = await this.userService.isUser(intra_id);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateRtUser(user_id: string) {
    const user = await this.userService.getOneUser(user_id);
  }

  async getToken(payload: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_AT_SECRET'),
        expiresIn: 60 * 60 * 24 * 15,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_RT_SECRET'),
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
  async getACToken(user) {
    const payload = {
      intra_id: user.intra_id,
      nickname: user.nickname,
      id: user.id,
    };
    const at = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_AT_SECRET'),
      expiresIn: 60 * 15,
    });

    return at;
  }
}

// export const hash = async (plainText: string): Promise<string> => {
//   const saltOrRounds = 10;
//   return await bcrypt.hash(plainText, saltOrRounds);
// };
