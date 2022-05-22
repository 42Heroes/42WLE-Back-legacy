import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChatRoom } from 'schemas/chatRoom/chatRoom.schema';
import { Post } from 'schemas/post/post.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  intra_id: string;

  @Prop({ required: true })
  image_url: string;

  @Prop({ required: true })
  campus: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop([String])
  hashtags: string[];

  @Prop()
  country: string;

  @Prop()
  github_id: string;

  @Prop()
  introduction: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' }] })
  chatRooms: ChatRoom[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  liked_users: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  saved_posts: Post[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts: Post[];

  @Prop({ required: true })
  n_language: string[];

  @Prop({ required: true })
  l_language: string[];

  @Prop({ required: true })
  join_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
