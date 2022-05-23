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
import { User } from '../../schemas/user/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  // @Patch('/me')
  // async updateUser() {
  //   return
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

  // @Delete('/:id')
  // remove(@Param('id') userId: number) {
  //   return this.userService.deleteOne(userId);
  // }

  // @Patch('/:id')
  // patch(@Param('id') userId: number, @Body() updateData: any) {
  //   // any 부분은 dto를 정의하면서 채웁니다
  //   return this.userService.update(userId, updateData);
  // }
}
