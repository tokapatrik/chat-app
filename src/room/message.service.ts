import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './enitities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';
import { RoomService } from './room.service';
import { Room } from './enitities/room.entity';
import { GetMessagesPaginationDto } from './dto/get-messages-pagination.dto';
import { CursorPaginationMeta } from 'src/common/queryin/schemas/cursor-pagination-meta.schema';

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

  async findByRoomId(
    roomId: Room['id'],
    query: GetMessagesPaginationDto,
  ): Promise<CursorPaginationMeta<Message>> {
    const { cursor, limit } = query;

    const qb = this.messageRepository
      .createQueryBuilder('message')
      .where('message.roomId = :roomId', { roomId })
      .orderBy('message.created_at', 'DESC')
      .addOrderBy('message.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      qb.andWhere('message.created_at < :cursor', {
        cursor: new Date(cursor),
      });
    }

    const itemsPlusOne = await qb.getMany();

    const hasNext = itemsPlusOne.length > limit;
    const items = hasNext ? itemsPlusOne.slice(0, limit) : itemsPlusOne;

    const nextCursor =
      hasNext && items.length > 0
        ? items[items.length - 1].created_at.toISOString()
        : null;

    return {
      items,
      nextCursor,
      hasNext,
      count: items.length,
    };
  }
}
