import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './enitities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';
import { RoomService } from './room.service';
import { Room } from './enitities/room.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly roomService: RoomService,
  ) {}

  async create(
    roomId: Room['id'],
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const { text } = createMessageDto;

    const room = await this.roomService.findById(roomId);

    const message = this.messageRepository.create({
      text,
      room,
    });

    return await this.messageRepository.save(message);
  }

  findByRoomId(roomId: Room['id']): Promise<Message[]> {
    return this.messageRepository.findBy({ room: { id: roomId } });
  }
}
