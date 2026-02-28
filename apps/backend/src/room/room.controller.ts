import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CursorPaginationMeta } from '../common/queryin/schemas/cursor-pagination-meta.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetMessagesPaginationDto } from './dto/get-messages-pagination.dto';
import { GetRoomParamDto } from './dto/get-room-param.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Message } from './enitities/message.entity';
import { Room } from './enitities/room.entity';
import { MessageService } from './message.service';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService
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
    @Body() updateRoomDto: UpdateRoomDto
  ): Promise<Room> {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  async delete(@Param() { id }: GetRoomParamDto): Promise<void> {
    return this.roomService.delete(id);
  }

  @Get(':id/messages')
  findByRoomId(
    @Param() { id }: GetRoomParamDto,
    @Query() query: GetMessagesPaginationDto
  ): Promise<CursorPaginationMeta<Message>> {
    return this.messageService.findByRoomId(id, query);
  }
}
