import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    const result = await newUser.save();
    console.log(result);
    return result;
  }

  async getOneUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`Can't find user ${id}`);
    }

    return user;
  }

  async getAllUser(): Promise<User[]> {
    const allUser = await this.userModel.find().exec();
    if (!allUser) {
      throw new NotFoundException(`Can't find`);
    }
    return allUser;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    //TODO: Auth JWT 로 변경 예정
    const user = await this.getOneUser(updateUserDto.id);

    const { id, ...rest } = updateUserDto;
    console.log(rest);
    await user.updateOne(rest);

    return user;
  }
}
