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
import { roomMap } from './roomMap';
import { userMap } from './userMap';

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly eventService: EventsService) {}

  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
    console.log('webSocketServerInit');
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.RequestCall)
  handleRequestCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomNo: string,
  ) {
    if (roomMap[roomNo]) {
      const isExistUser = roomMap[roomNo].find(
        (user) => user.socketId === socket.id,
      );
      if (!isExistUser) {
        roomMap[roomNo].push({ socketId: socket.id, id: socket.data.intra_id });
      }
    } else {
      roomMap[roomNo] = [{ socketId: socket.id, id: socket.data.intra_id }];
    }
    socket.data.currentRoom = roomNo;
    return socket.to(roomNo).emit(SocketEvents.RequestCall, { roomNo });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.AcceptCall)
  handleAcceptCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomNo: string,
  ) {
    let result = {};
    if (roomMap[roomNo]) {
      const existUser = roomMap[roomNo].find(
        (user) => user.socketId === socket.id,
      );
      if (!existUser) {
        roomMap[roomNo].push({ socketId: socket.id, id: socket.data.intra_id });
      }
      result = roomMap[roomNo].filter((user) => user.socketId !== socket.id);
    } else {
      result = roomMap[roomNo] = [
        { socketId: socket.id, id: socket.data.intra_id },
      ];
    }
    socket.data.currentRoom = roomNo;
    this.server.to(socket.id).emit(SocketEvents.AcceptCall, result);
    return;
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.RejectCall)
  handleRejectCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomNo: string,
  ) {
    return socket.to(roomNo).emit(SocketEvents.RejectCall, { roomNo });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.CancelCall)
  handleCancelCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomNo: string,
  ) {
    return socket.to(roomNo).emit(SocketEvents.CancelCall, { roomNo });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.EndCall)
  handleEndCall(@ConnectedSocket() socket: Socket) {
    if (roomMap[socket.data?.currentRoom]) {
      roomMap[socket.data.currentRoom] = roomMap[
        socket.data.currentRoom
      ].filter((user) => user.socketId !== socket.id);
      const payload = {
        roomNo: socket.data.currentRoom,
        socketId: socket.id,
      };
      if (roomMap[socket.data.currentRoom].length === 0) {
        socket
          .to(socket.data.currentRoom)
          .emit(SocketEvents.CancelCall, payload);
        return { roomId: socket.data.currentRoom, status: 'cancel' };
      } else {
        socket.to(socket.data.currentRoom).emit(SocketEvents.ExitUser, payload);
      }
    }
    return { roomId: socket.data.currentRoom, status: 'end' };
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.Offer)
  handleRTCOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody('offer') offer: RTCSessionDescriptionInit,
    @MessageBody('offerReceiverId') offerReceiverId: string,
  ) {
    return socket
      .to(offerReceiverId)
      .emit(SocketEvents.Offer, { offer, offerSenderId: socket.id });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.Answer)
  handleRTCAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody('answer') answer: RTCSessionDescriptionInit,
    @MessageBody('answerReceiverId') answerReceiverId: string,
  ) {
    return socket
      .to(answerReceiverId)
      .emit(SocketEvents.Answer, { answer, answerSenderId: socket.id });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.IceCandidate)
  handleIceCandidate(
    @ConnectedSocket() socket: Socket,
    @MessageBody('candidate') candidate: any,
    @MessageBody('candidateReceiverId') candidateReceiverId: string,
  ) {
    return socket.to(candidateReceiverId).emit(SocketEvents.IceCandidate, {
      candidate,
      candidateSenderId: socket.id,
    });
  }

  // * 메시지
  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.Message)
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ) {
    return this.eventService.sendMessage(socket, sendMessageDto);
  }

  // * 채팅방 생성 요청
  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.ReqCreateRoom)
  createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('target_id') targetId: string,
  ) {
    return this.eventService.createRoom(socket, targetId);
  }

  // * 인증 및 socket 유저 데이터 주입
  @SubscribeMessage(SocketEvents.Authorization)
  authorization(
    @ConnectedSocket() socket: Socket,
    @MessageBody('token') token: string,
  ) {
    return this.eventService.authorization(socket, token);
  }

  // * 초기 데이터 가져오기
  @UseGuards(WsGuard)
  @SubscribeMessage(SocketEvents.ReqInitialData)
  initialData(@ConnectedSocket() socket: Socket) {
    return this.eventService.getInitialData(socket);
  }

  // * 소켓이 연결됐을 때
  handleConnection(@ConnectedSocket() socket: Socket) {
    socket.data.authenticate = false;
  }

  // * 소켓 연결 끊겼을 때
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    if (roomMap[socket.data?.currentRoom]) {
      roomMap[socket.data.currentRoom] = roomMap[
        socket.data.currentRoom
      ].filter((user) => user.socketId !== socket.id);
      socket.to(socket.data.currentRoom).emit(SocketEvents.ExitUser, {
        roomNo: socket.data.currentRoom,
        socketId: socket.id,
      });
    }
    userMap.delete(socket.data.intra_id);
    console.log(roomMap, userMap);
    console.log('disconnected', socket.nsp.name);
  }
}
