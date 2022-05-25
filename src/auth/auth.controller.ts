import { Controller, Get, UseGuards } from '@nestjs/common';
import { FortyTwoAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { FortyTwoDto } from './dto/fortyTwo.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoAuth() {
    return 'success';
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('/42/callback')
  fortyTwoAuthRedirect(@GetUser() fortyTwoDto: FortyTwoDto) {
    return this.authService.fortyTwoLogin(fortyTwoDto);
  }
}
