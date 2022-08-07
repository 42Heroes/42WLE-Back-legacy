import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { FortyTwoDto } from './dto/fortyTwo.dto';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/schemas/user/user.schema';

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
      id: user.id,
    };

    const tokens = await this.getToken(payload);

    user.rt = await bcrypt.hash(tokens.refreshToken, 10);
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
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_AT_SECRET'),
        expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_RT_SECRET'),
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getAccessToken(user: UserDocument) {
    const { intra_id, id } = user;

    const payload = {
      intra_id,
      id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_AT_SECRET'),
      expiresIn: 60 * 15,
    });

    return accessToken;
  }
}
