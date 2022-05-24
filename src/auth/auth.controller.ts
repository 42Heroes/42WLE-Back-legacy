import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { FortyTwoAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth() {
    return 'success';
  }

  @Get()
  async checkIndex() {
    return 'success';
  }

  @Get('/42/callback')
  @UseGuards(AuthGuard('42'))
  fortyTwoAuthRedirect(a, b, c, d, e) {
    // return this.authService.fortyTwoLogin(req);
    return 'good';
  }
}
