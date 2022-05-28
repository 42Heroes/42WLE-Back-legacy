import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { SocketEvents } from './event.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async getInitialData(socket: Socket) {
    /*
      1. 유저 확인
      2. 유저가 속해있는 채팅방 확인
      3. 해당 채팅방에 있는 메시지 가져오기
    */
    const { id } = socket.data;
    const user = await (
      await this.userService.getOneUser(id)
    ).populate('chatRooms');
  }

  authorization(socket: Socket, token: string) {
    const bearerToken = token?.split(' ')[1];

    try {
      const decode = this.jwtService.verify(bearerToken, { secret: 'gamguma' });

      socket.data.authenticate = true;
      socket.data.id = decode.id;
      socket.data.intra_id = decode.intra_id;
      socket.emit(SocketEvents.Authorization, {
        status: 'ok',
        message: '인증에 성공했습니다.',
      });
    } catch (error) {
      socket.emit(SocketEvents.Error, { message: '인증에 실패했습니다.' });
      socket.disconnect();
    }
  }
}
