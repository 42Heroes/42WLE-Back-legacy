import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from 'src/schemas/chatRoom/chatRoom.schema';
import { Message, MessageSchema } from 'src/schemas/message/message.schema';
import { UserModule } from 'src/user/user.module';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ChatRoom.name,
        useFactory: () => {
          const schema = ChatRoomSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
      {
        name: Message.name,
        useFactory: () => {
          const schema = MessageSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
    UserModule,
  ],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
