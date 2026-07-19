import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomMember } from './entity/room-member.entity';
import { Room } from './entity/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AdminGuard } from '../auth/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomMember])],
  controllers: [RoomsController],
  providers: [RoomsService, AdminGuard],
})
export class RoomsModule {}
