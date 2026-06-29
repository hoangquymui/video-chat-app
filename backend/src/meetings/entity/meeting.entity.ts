import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type MeetingStatus = 'active' | 'ended';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @Column({
    unique: true,
    length: 20,
  })
  meetingCode: string;

  @Column()
  startedBy: number;

  @Column({
    default: 'active',
  })
  status: MeetingStatus;

  @CreateDateColumn()
  startedAt: Date;

  @Column({
    nullable: true,
    type: 'datetime',
  })
  endedAt: Date | null;
}
