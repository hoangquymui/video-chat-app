import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('room_messages')
export class RoomMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  senderId: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
