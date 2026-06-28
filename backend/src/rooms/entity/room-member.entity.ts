import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('room_members')
export class RoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column()
  userId: number;

  @Column({ default: 'member' })
  role: string;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => Room, (room) => room.members, {
    onDelete: 'CASCADE',
  })
  room: Room;
}
