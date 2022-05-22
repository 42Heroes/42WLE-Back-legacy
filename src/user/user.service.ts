import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
