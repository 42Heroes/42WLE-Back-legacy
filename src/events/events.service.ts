import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { SocketEvents } from './event.enum';
import { UserService } from '../user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { SendMessageDto } from 'src/chat/dto/sendMessage.dto';
import { MessageDocument } from 'src/schemas/message/message.schema';
import { userMap } from './userMap';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  async createRoom(socket: Socket, targetUserId: string) {
    const newRoom = await this.chatService.createChatRoom(
      socket.data.id,
      targetUserId,
    );
    const payload = { status: 'ok', chatRoom: newRoom };
    socket.join(newRoom.id);
    if (userMap.has(targetUserId)) {
      socket.in(userMap.get(targetUserId)).socketsJoin(newRoom.id);
      socket.broadcast.to(newRoom.id).emit(SocketEvents.ReqCreateRoom, payload);
    }
    return payload;
  }

  async getInitialData(socket: Socket) {
    const { id } = socket.data;

    const user = await (
      await this.userService.getOneUser(id)
    ).populate('chatRooms');

    const result = await Promise.all(
      user.chatRooms.map(async (chatRoom) => {
        socket.join(chatRoom.id);

        const messages = await this.chatService.getAllMessages(chatRoom.id);

        return {
          ...chatRoom.toObject(),
          messages,
        };
      }),
    );

    return result;
  }

  async sendMessage(socket: Socket, sendMessageDto: SendMessageDto) {
    const message = await this.chatService.createMessage(
      socket.data.id,
      sendMessageDto,
    );
    this.sendMessageToOther(socket, sendMessageDto.chatRoom_id, message);
    return message;
  }

  sendMessageToOther(
    socket: Socket,
    chatRoom_id: string,
    message: MessageDocument,
  ) {
    socket.to(chatRoom_id).emit(SocketEvents.Message, message);
  }

  authorization(socket: Socket, token: string) {
    const bearerToken = token?.split(' ')[1];
    console.log(bearerToken);

    try {
      const decode = this.jwtService.verify(bearerToken, {
        secret: this.configService.get<string>('JWT_AT_SECRET'),
      });
      console.log(decode);

      socket.data.authenticate = true;
      socket.data.id = decode.id;
      socket.data.intra_id = decode.intra_id;
      userMap.set(decode.id, socket.id);
      return {
        status: 'ok',
        message: '인증에 성공했습니다.',
      };
    } catch (error) {
      socket.emit(SocketEvents.Error, { message: '인증에 실패했습니다.' });
      socket.disconnect();
    }
  }
}
