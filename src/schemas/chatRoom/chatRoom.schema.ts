import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';

export type ChatRoomDocument = ChatRoom & mongoose.Document;

@Schema()
export class ChatRoom {
  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  users: User[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
