import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor() {}
  fortyTwoLogin(req) {
    if (!req.user) {
      return 'No user from 42';
    }
    return {
      message: 'User Info from 42',
      user: req.user,
    };
  }
}
