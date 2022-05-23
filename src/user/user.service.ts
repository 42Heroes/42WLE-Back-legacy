import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(userData) {
    const newUser = new this.userModel(userData);
    const result = await newUser.save();
    console.log(result);
    return result;
  }

  // async create(createCatDto: CreateCatDto): Promise<User[]> {
  //   const newUser = new this.userModel({});

  //   const createdCat = new this.userModel(createCatDto);
  //   return createdCat.save();
  // }

  // async findAll(): Promise<User[]> {
  //   return this.userModel.find().exec();
  // }

  // async findOne(): Promise<User> {
  //   return this.userModel.findOne({});
  // }
}
