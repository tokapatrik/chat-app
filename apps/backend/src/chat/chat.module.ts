import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule],
  providers: [ChatGateway]
})
export class ChatModule {}
