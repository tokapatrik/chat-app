import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoomService } from '../../../room/room.service';
import { ChatSocket } from '../../interfaces/chat-socket.interface';

@Injectable()
export class RoomContextGuard implements CanActivate {
  constructor(private readonly roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<ChatSocket>();

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
