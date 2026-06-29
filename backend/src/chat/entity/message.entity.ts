import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  conversationId: number | null;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  meetingCode: string | null;

  @Column({
    type: 'int',
  })
  senderId: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
