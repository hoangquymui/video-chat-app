import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entity/meeting.entity';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Message } from 'src/chat/entity/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Message])],
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
