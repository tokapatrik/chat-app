import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatSocket } from 'src/chat/interfaces/chat-socket.interface';

export const CurrentRoom = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const client = ctx.switchToWs().getClient<ChatSocket>();
    const roomId = client.data.room?.roomId;

    if (roomId === undefined) {
      throw new WsException('No room context found for the current client.');
    }

    return roomId;
  },
);
