import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomService } from 'src/room/room.service';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from 'src/room/message.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  handleConnection(client: Socket): void {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async onRoomJoin(@ConnectedSocket() client: Socket, @MessageBody() joinRoomDto: JoinRoomDto): Promise<void> {
    const { roomId } = joinRoomDto;

    const room = await this.roomService.findById(roomId);

    // Leave all rooms except the default room (which is the client's own room)
    for (const joinedRoom of client.rooms) {
      if (joinedRoom !== client.id) {
        await client.leave(joinedRoom);
      }
    }

    await client.join(room.id);
  }

  @SubscribeMessage('leave')
  async onRoomLeave(client: Socket, leaveRoomDto: LeaveRoomDto): Promise<void> {
    const { roomId } = leaveRoomDto;

    await client.leave(roomId);
  }

  @SubscribeMessage('message')
  async onMessage(client: Socket, createMessageDto: CreateMessageDto): Promise<void> {
    const { roomId } = createMessageDto;

    if (!client.rooms.has(roomId)) {
      return;
    }

    const message = await this.messageService.create(roomId, createMessageDto);

    client.to(roomId).emit('message', message.text);
  }
}
