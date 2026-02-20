import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatSocket } from 'src/chat/interfaces/chat-socket.interface';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class RoomContextGuard implements CanActivate {
  constructor(private readonly roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: ChatSocket = context.switchToWs().getClient();

    const roomId = client.data.room?.roomId;
    if (!roomId) {
      return false;
    }

    const room = await this.roomService.findById(roomId);
    if (!room) {
      return false;
    }

    return true;
  }
}
