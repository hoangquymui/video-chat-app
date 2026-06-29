import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingsService } from './meetings.service';

type AuthRequest = Request & {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
};

@Controller('meetings')
@UseGuards(AuthGuard('jwt'))
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(@Body() body: CreateMeetingDto, @Req() req: AuthRequest) {
    return this.meetingsService.create(body, req.user.id);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.meetingsService.findById(id);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.meetingsService.findByRoom(roomId);
  }

  @Patch(':id/end')
  end(@Param('id', ParseIntPipe) id: number) {
    return this.meetingsService.end(id);
  }

  @Get('code/:meetingCode')
  findByCode(
    @Param('meetingCode')
    meetingCode: string,
  ) {
    return this.meetingsService.findByCode(meetingCode);
  }
}
