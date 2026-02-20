import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './enitities/room.entity';
import { Repository } from 'typeorm';
import { GetRoomParamDto } from './dto/get-room-param.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async findById(id: GetRoomParamDto['id']): Promise<Room> {
    const room = await this.roomRepository.findOneBy({ id });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return room;
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async create(createRoomDto: Partial<Room>): Promise<Room> {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async update(id: GetRoomParamDto['id'], updateRoomDto: Partial<Room>): Promise<Room> {
    const room = await this.roomRepository.preload({
      id,
      ...updateRoomDto,
    });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return this.roomRepository.save(room);
  }

  async delete(id: GetRoomParamDto['id']): Promise<void> {
    const room = await this.findById(id);
    await this.roomRepository.remove(room);
  }
}
