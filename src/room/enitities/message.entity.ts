import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinTable } from 'typeorm';

import { Room } from './room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 250 })
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @JoinTable()
  @ManyToOne(() => Room, (room: Room) => room.messages)
  room: Room;
}
