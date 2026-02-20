import { DefaultEventsMap, Socket } from 'socket.io';
import { MessageRoom } from './message-room.interface';

interface ChatSocketData {
  room: MessageRoom | undefined;
}

export type ChatSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, ChatSocketData>;
