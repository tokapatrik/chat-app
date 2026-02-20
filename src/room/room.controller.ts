import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';
import { GetRoomParamDto } from './dto/get-room-param.dto';
import { MessageService } from './message.service';
import { Room } from './enitities/room.entity';
import { Message } from './enitities/message.entity';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  async find(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Patch(':id')
  async update(
    @Param() { id }: GetRoomParamDto,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  async delete(@Param() { id }: GetRoomParamDto): Promise<void> {
    return this.roomService.delete(id);
  }

  @Get(':id/messages')
  findByRoomId(@Param() { id }: GetRoomParamDto): Promise<Message[]> {
    return this.messageService.findByRoomId(id);
  }
}
