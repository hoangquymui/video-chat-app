import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomMember } from './entity/room-member.entity';
import { Room } from './entity/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomMember])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
