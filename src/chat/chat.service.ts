import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
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

  async createMessage(user_id: string, sendMessageDto: SendMessageDto) {
    const newMessage = new this.messageModel({
      ...sendMessageDto,
      user_id,
    });
    const result = await newMessage.save();
    return result;
  }

  async getChatRoom(chatRoom_id: string) {
    const chatRoom = this.chatRoomModel.findById(chatRoom_id);
    if (!chatRoom) {
      throw new WsException(`not found ChatRoom ${chatRoom_id}`);
    }

    return chatRoom;
  }

  async createChatRoom(myId: string, otherId: string) {
    const me = await (
      await this.userService.getOneUser(myId)
    ).populate('chatRooms');
    const other = await (
      await this.userService.getOneUser(otherId)
    ).populate('chatRooms');

    const foundRoom = me.chatRooms.find((chatRoom) =>
      other.chatRooms.some((otherChatRoom) => otherChatRoom.id === chatRoom.id),
    );

    if (foundRoom) {
      return foundRoom;
    }

    try {
      const newChatRoom = new this.chatRoomModel();

      newChatRoom.users.push(me, other);
      await newChatRoom.save();

      await me.updateOne({ $addToSet: { chatRooms: newChatRoom.id } });
      await other.updateOne({ $addToSet: { chatRooms: newChatRoom.id } });
      return newChatRoom;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 501);
      // return;
    }
  }
}
