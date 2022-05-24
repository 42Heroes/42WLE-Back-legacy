import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { FortyTwoAuthGuard } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('42'))

  @Get('/login')
  async fortyTwoAuth() {
    return 'success';
  }

  @Get()
  async checkIndex() {
    return 'success';
  }

  // @UseGuards(AuthGuard('42'))

  @Get('/42/callback')
  fortyTwoAuthRedirect(@Req() req) {
    return 'work';
    // return this.authService.fortyTwoLogin(req);
  }
}
