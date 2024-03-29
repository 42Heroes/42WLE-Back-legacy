import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from 'src/schemas/user/user.schema';
import { FortyTwoAuthGuard, JwtRefreshGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { FortyTwoDto } from './dto/fortyTwo.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('/social/42')
  async fortyTwoAuthRedirect(
    @GetUser() fortyTwoDto: FortyTwoDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens } = await this.authService.fortyTwoLogin(fortyTwoDto);

    res.cookie('refresh-token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return tokens.accessToken;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async silentRefresh(@GetUser() user: UserDocument) {
    return this.authService.getAccessToken(user);
  }
}
