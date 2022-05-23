import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
// import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  // async create(createCatDto: CreateCatDto): Promise<Post> {
  //   const createdPost = new this.postModel(createCatDto);
  //   return createdPost.save();
  // }

  // async findAll(): Promise<Post[]> {
  //   return this.postModel.find().exec();
  // }
}
