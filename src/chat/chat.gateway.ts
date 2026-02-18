import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomService } from 'src/room/room.service';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
@UsePipes(new ValidationPipe())
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket): void {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket): void {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('join')
  async onRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinRoomDto: JoinRoomDto,
  ): Promise<void> {
    const { roomId } = joinRoomDto;

    const room = await this.roomService.findOne(roomId);

    if (!room) {
      return;
    }

    await client.join(roomId);
  }

  @SubscribeMessage('leave')
  async onRoomLeave(client: Socket, leaveRoomDto: LeaveRoomDto) {
    const { roomId } = leaveRoomDto;

    await client.leave(roomId);
  }

  @SubscribeMessage('message')
  async onMessage(client: Socket, createMessageDto: CreateMessageDto) {
    const { roomId } = createMessageDto;

    if (!client.rooms.has(roomId)) {
      return;
    }

    const message = await this.roomService.createMessage(
      roomId,
      createMessageDto,
    );

    client.to(roomId).emit('message', message.text);
  }
}
