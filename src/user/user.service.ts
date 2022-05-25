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

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    const result = await newUser.save();

    return result as UserDocument;
  }

  async getOneUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`Can't find user ${userId}`);
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

  async isUser(intra_id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ intra_id });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { ...updateUserDto, isRegisterDone: true },
      { new: true },
    );

    return updatedUser;
  }
}
