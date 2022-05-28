import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatRoom,
  ChatRoomDocument,
} from 'src/schemas/chatRoom/chatRoom.schema';
import { Message, MessageDocument } from 'src/schemas/message/message.schema';
import { UserService } from 'src/user/user.service';
import { SendMessageDto } from './dto/sendMessage.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly userService: UserService,
  ) {}

  async getAllMessages(chatRoom_id: string) {
    const result = await this.messageModel.find({ chatRoom_id });
    return result;
  }

  async createMessage(author: string, sendMessageDto: SendMessageDto) {
    const newMessage = new this.messageModel({
      ...sendMessageDto,
      user_id: author,
    });
    const result = await newMessage.save();
    return result;
  }

  async createChatRoom(myId: string, otherId: string) {
    const me = await this.userService.getOneUser(myId);
    const other = await this.userService.getOneUser(otherId);

    try {
      const newChatRoom = new this.chatRoomModel();

      newChatRoom.users.push(me, other);
      await newChatRoom.save();

      await me.updateOne({ $addToSet: { chatRooms: newChatRoom.id } });
      await other.updateOne({ $addToSet: { chatRooms: newChatRoom.id } });
      return newChatRoom;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
