import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  fortyTwoLogin(req) {
    if (!req.user) {
      return 'No user from 42';
    }
    console.log(req);
    return {
      message: 'User Info from 42',
      user: req.user,
    };
  }

  validateUser(intra_id: string) {
    const user = this.userService.getOneUser(intra_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
