import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';
import { Comment } from '../comment/comment.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  author: User;

  @Prop({ required: true })
  content: string;

  @Prop()
  images: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likes: User[];

  @Prop()
  category: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
