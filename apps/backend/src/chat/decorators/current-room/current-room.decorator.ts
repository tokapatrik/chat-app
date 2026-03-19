import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatSocket } from '../../interfaces/chat-socket.interface';
import { MessageRoom } from 'src/chat/interfaces/message-room.interface';

export const CurrentRoom = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): MessageRoom => {
    const client = ctx.switchToWs().getClient<ChatSocket>();
    const roomId = client.data.room;

    if (roomId === undefined) {
      throw new WsException('No room context found for the current client.');
    }

    return roomId;
  }
);
