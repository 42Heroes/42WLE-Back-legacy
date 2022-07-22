import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChatRoom } from 'src/schemas/chatRoom/chatRoom.schema';
import { User } from 'src/schemas/user/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true,
  })
  chatRoom_id: ChatRoom;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: User;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
