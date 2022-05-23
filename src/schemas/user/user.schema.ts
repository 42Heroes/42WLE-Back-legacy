import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChatRoom } from 'schemas/chatRoom/chatRoom.schema';
import { Post } from 'schemas/post/post.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  nickname: string;

  // @Prop({ required: true })
  @Prop()
  intra_id: string;

  // @Prop({ required: true })
  @Prop()
  image_url: string;

  // @Prop({ required: true })
  @Prop()
  campus: string;

  // @Prop({ required: true })
  @Prop()
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

  @Prop()
  n_language: string[];

  // @Prop({ required: true })
  @Prop()
  l_language: string[];

  // @Prop({ required: true })
  @Prop()
  join_date: Date;

  @Prop({ type: Boolean, default: false })
  isRegisterDone: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
