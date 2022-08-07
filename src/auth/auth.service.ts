import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { FortyTwoDto } from './dto/fortyTwo.dto';
import { UserDocument } from 'src/schemas/user/user.schema';
import {
  RefreshToken,
  RefreshTokenDocument,
} from 'src/schemas/auth/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
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

    await this.updateRefreshToken(user, tokens.refreshToken);

    return { tokens };
  }

  async validateUser(intra_id: string) {
    const user = await this.userService.isUser(intra_id);

    if (!user) {
      return null;
    }

    return user;
  }

  async updateRefreshToken(user: UserDocument, refreshToken: string) {
    const token = await this.refreshTokenModel.findOne({ user: user.id });

    if (!token) {
      const newToken = new this.refreshTokenModel({
        user: user.id,
        refreshToken,
      });
      await newToken.save();
    } else {
      token.refreshToken = refreshToken;
      await token.save();
    }
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

  async getRefreshToken(user: UserDocument) {
    const token = await this.refreshTokenModel.findOne({ user: user.id });

    if (!token) {
      return null;
    }

    return token;
  }
}
