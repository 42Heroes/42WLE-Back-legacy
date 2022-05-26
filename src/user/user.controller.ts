import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user/user.schema';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@GetUser() user: UserDocument) {
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
