import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth() {
    return 'success';
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('/42/callback')
  fortyTwoAuthRedirect(@Req() req) {
    return this.authService.fortyTwoLogin(req.user);
  }
}
