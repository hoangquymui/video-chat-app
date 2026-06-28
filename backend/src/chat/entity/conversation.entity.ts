import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userAId: number;

  @Column()
  userBId: number;

  @CreateDateColumn()
  createdAt: Date;
}
