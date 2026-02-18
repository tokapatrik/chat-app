import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './enitities/room.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';
import { Message } from './enitities/message.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findOne(id: string) {
    const room = await this.roomRepository.findOneBy({ id });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return room;
  }

  async findAll() {
    return this.roomRepository.find();
  }

  async create(createRoomDto: Partial<Room>) {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async update(id: string, updateRoomDto: Partial<Room>) {
    const room = await this.roomRepository.preload({
      id,
      ...updateRoomDto,
    });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return this.roomRepository.save(room);
  }

  async createMessage(
    roomId: Room['id'],
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const { text } = createMessageDto;

    const room = await this.findOne(roomId);

    const message = this.messageRepository.create({
      text,
      room,
    });

    return await this.messageRepository.save(message);
  }

  async delete(id: string) {
    const room = await this.findOne(id);
    await this.roomRepository.remove(room);
  }
}
