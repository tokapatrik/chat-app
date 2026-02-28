import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './enitities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Message } from './enitities/message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message])],
  providers: [RoomService, MessageService],
  controllers: [RoomController],
  exports: [RoomService, MessageService]
})
export class RoomModule {}
