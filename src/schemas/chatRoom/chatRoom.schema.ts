import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';

export type ChatRoomDocument = ChatRoom & mongoose.Document;

@Schema()
export class ChatRoom {
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({
    required: true,
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    ],
  })
  users: User[];

  @Prop({ default: [] })
  messages: [];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
