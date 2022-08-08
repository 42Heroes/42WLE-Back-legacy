import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChatRoomDocument } from 'src/schemas/chatRoom/chatRoom.schema';
import { Post } from 'src/schemas/post/post.schema';
import { Board, BoardDocument } from 'src/schemas/board/board.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop()
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

  @Prop({ required: true, default: Date.now })
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
  chatRooms: ChatRoomDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  liked_users: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  saved_posts: Post[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }] })
  board: BoardDocument[];

  @Prop()
  n_language: string[];

  // @Prop({ required: true })
  @Prop()
  l_language: string[];

  // @Prop({ required: true })
  @Prop({ type: Date })
  join_date: Date;

  @Prop({ type: Boolean, default: false })
  isRegisterDone: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
