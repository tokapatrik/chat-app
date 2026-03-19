import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import { CurrentRoom } from './decorators/current-room/current-room.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { MessageService } from '../room/message.service';
import { RoomContextGuard } from './guards/message/room-context.guard';
import { ChatSocket } from './interfaces/chat-socket.interface';
import { MessageRoom } from './interfaces/message-room.interface';
import { RoomService } from '../room/room.service';
import { Room } from 'src/room/enitities/room.entity';
import { Message } from 'src/room/enitities/message.entity';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService
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
    @MessageBody() joinRoomDto: JoinRoomDto
  ): Promise<Room> {
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

    return room;
  }

  @SubscribeMessage('leave')
  async onRoomLeave(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() leaveRoomDto: LeaveRoomDto
  ): Promise<Room> {
    const { roomId } = leaveRoomDto;

    await client.leave(roomId);

    const room = await this.roomService.findById(roomId);

    return room;
  }

  @UseGuards(RoomContextGuard)
  @SubscribeMessage('message')
  async onMessage(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() createMessageDto: CreateMessageDto,
    @CurrentRoom() room: MessageRoom
  ): Promise<Message> {
    const message = await this.messageService.create(room.roomId, createMessageDto);

    client.to(room.roomId).emit('message', message);

    return message;
  }
}
