import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user/user.schema';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@GetUser() user: UserDocument, @Req() req: Request) {
    console.log(req.cookies);
    console.log(req.headers);

    return this.userService.getOneUser(user.id);
  }

  @Put('/me')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UserDocument,
  ) {
    return this.userService.updateUser(updateUserDto, user.id);
  }

  @Patch('/me/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfileImage(
    @GetUser() user: UserDocument,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfileImage(
      user.id,
      updateProfileDto.image_url,
    );
  }

  @Patch('/me/like/:id')
  @UseGuards(JwtAuthGuard)
  async addLikeUser(
    @Param('id') targetId: string,
    @GetUser() user: UserDocument,
  ) {
    return this.userService.addLikeUser(targetId, user.id);
  }

  @Delete('/me/like/:id')
  @UseGuards(JwtAuthGuard)
  async deleteLikeUser(
    @Param('id') targetId: string,
    @GetUser() user: UserDocument,
  ) {
    return this.userService.deleteLikeUser(targetId, user.id);
  }

  @Get('/:id')
  async getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser(userId);
  }
}
