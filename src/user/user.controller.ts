import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from '../schemas/user/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get('/:id')
  async getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser(userId);
  }

  @Patch('/me')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  // @Delete('/:id')
  // remove(@Param('id') userId: number) {
  //   return this.userService.deleteOne(userId);
  // }

  // @Get()
  // findAll(): User[] {
  //   return this.userService.findAll();
  // }

  // @Get('/:id')
  // getOne(@Param('id') userId: number): User {
  //   return this.userService.getOne(userId);
  // }

  // @Post()
  // create(@Body() userData: any) {
  //   // any 부분은 dto를 정의하면서 채웁니다
  //   return this.userService.create(userData);
  // }

  // @Patch('/:id')
  // patch(@Param('id') userId: number, @Body() updateData: any) {
  //   // any 부분은 dto를 정의하면서 채웁니다
  //   return this.userService.update(userId, updateData);
  // }
}