import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Meghatározzuk az üzenet típusát, hogy ne használjunk 'any'-t
interface ChatMessage {
  text: string;
  sender: string;
}

@WebSocketGateway(3006)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    console.log('Client connected', client.id);

    client.broadcast.emit('user-joined', {
      message: `User joined the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket): void {
    console.log('Client disconnected', client.id);

    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: ChatMessage,
  ): void {
    console.log(
      'New message from',
      client.id,
      ':',
      message,
      new Date().toISOString(),
    );

    this.server.emit('message', {
      message,
      senderId: client.id,
    });
  }
}
