import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuard } from 'src/auth/auth.guard';
import { SendMessageDto } from 'src/chat/dto/sendMessage.dto';
import { SocketEvents } from './event.enum';
import { EventsService } from './events.service';

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly eventService: EventsService) {}

  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
    console.log('webSocketServerInit');
  }

  // * 메시지
  // @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.Message)
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ) {
    return this.eventService.sendMessage(socket, sendMessageDto);
  }

  // * 채팅방 생성 요청
  // @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.ReqCreateRoom)
  createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('target') targetId: string,
  ) {
    return this.eventService.createRoom(socket, targetId);
  }

  // * 1회 인증 및 socket 유저 데이터 주입
  // @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.Authorization)
  authorization(
    @ConnectedSocket() socket: Socket,
    @MessageBody('token') token: string,
  ) {
    return this.eventService.authorization(socket, token);
  }

  // * 초기 데이터 가져오기
  @SubscribeMessage(SocketEvents.ReqInitialData)
  initialData(@ConnectedSocket() socket: Socket) {
    return this.eventService.getInitialData(socket);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    socket.data.authenticate = false;
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);
  }
}

/*
  1. 소켓 연결 (socket.data.authenticate = false 로 초기화) ok
  2. 클라이언트 jwt 발급 후 authorization 이벤트 발송 (Token 포함) ok
  3. jwt token 확인 후 socket.data.authenticate = true, 기본 data 설정 후 authenticate 성공 이벤트 발송 ok
  4. 클라이언트 성공 이벤트 확인 후 initialData 요청 ok
  5. initialData 취합 ok
*/

/*
  1. 

*/

/*
  소켓 인증 방식

  초기 1회 인증
    장점
      - 간단함
    단점
      - 보안 우려

  매번 jwt 토큰 확인하여 인증
    장점
      - 보안 향상
    단점
      - 불필요한 db 접근이 있을 수도 있음

  개인적으론 매번 jwt 토큰 확인이 좋을 것 같음

*/
