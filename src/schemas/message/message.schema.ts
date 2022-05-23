import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChatRoom } from 'schemas/chatRoom/chatRoom.schema';
import { User } from 'schemas/user/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom' }],
    required: true,
  })
  chatRoom_id: ChatRoom;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  user_id: User;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
