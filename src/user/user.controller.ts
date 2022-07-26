import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
  Post,
  Res,
  HttpCode,
} from '@nestjs/common';
import { User } from '../schemas/user/user.schema';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@GetUser('id') userId: string) {
    return this.userService.getOneUser(userId);
  }

  @Put('/me')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser('id') userId: string,
  ) {
    return this.userService.updateUser(updateUserDto, userId);
  }

  @Patch('/me/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfileImage(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfileImage(userId, updateProfileDto);
  }

  @Patch('/me/like/:id')
  @UseGuards(JwtAuthGuard)
  async addLikeUser(
    @Param('id') targetId: string,
    @GetUser('id') userId: string,
    @Body('like') like: boolean,
  ) {
    console.log(targetId, userId, like);
    return this.userService.changeLikeUser(targetId, userId, like);
  }

  @Post('/me/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logoutUser(
    @GetUser('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh-token');
    return await this.userService.logoutUser(id);
  }

  @Get('/:id')
  async getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser(userId);
  }
}
