import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './enitities/message.entity';
import { Room } from './enitities/room.entity';
import { MessageService } from './message.service';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message])],
  providers: [RoomService, MessageService],
  controllers: [RoomController],
  exports: [RoomService, MessageService]
})
export class RoomModule {}
