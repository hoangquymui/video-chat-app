import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomMember } from './room-member.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => RoomMember, (member) => member.room)
  members: RoomMember[];
}
