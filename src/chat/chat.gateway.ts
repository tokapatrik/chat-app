import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomService } from 'src/room/room.service';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from 'src/room/message.service';
import { ChatSocket } from './interfaces/chat-socket.interface';
import { RoomContextGuard } from './guards/message/room-context.guard';
import { MessageRoom } from './interfaces/message-room.interface';
import { CurrentRoom } from './decorators/current-room/current-room.decorator';

@UsePipes(new ValidationPipe())
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  handleConnection(client: ChatSocket): void {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: ChatSocket): void {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async onRoomJoin(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() joinRoomDto: JoinRoomDto,
  ): Promise<void> {
    const { roomId } = joinRoomDto;

    const room = await this.roomService.findById(roomId);

    // Leave all rooms except the default room (which is the client's own room)
    for (const joinedRoom of client.rooms) {
      if (joinedRoom !== client.id) {
        await client.leave(joinedRoom);
      }
    }

    await client.join(room.id);
    client.data.room = { roomId: room.id };
  }

  @SubscribeMessage('leave')
  async onRoomLeave(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() leaveRoomDto: LeaveRoomDto,
  ): Promise<void> {
    const { roomId } = leaveRoomDto;

    await client.leave(roomId);
  }

  @UseGuards(RoomContextGuard)
  @SubscribeMessage('message')
  async onMessage(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() createMessageDto: CreateMessageDto,
    @CurrentRoom() room: MessageRoom,
  ): Promise<void> {
    const message = await this.messageService.create(
      room.roomId,
      createMessageDto,
    );

    client.to(room.roomId).emit('message', message.text);
  }
}
