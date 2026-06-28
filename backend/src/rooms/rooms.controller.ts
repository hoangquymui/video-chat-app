import {
  Body,
  Controller,
  Delete,
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
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

type AuthRequest = Request & {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
};

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() body: CreateRoomDto, @Req() req: AuthRequest) {
    return this.roomsService.create(body, req.user.id);
  }

  @Get('me')
  findMyRooms(@Req() req: AuthRequest) {
    return this.roomsService.findMyRooms(req.user.id);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string },
  ) {
    return this.roomsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }

  @Post(':roomId/members/:userId')
  addMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.roomsService.addMember(roomId, userId);
  }

  @Delete(':roomId/members/:userId')
  removeMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.roomsService.removeMember(roomId, userId);
  }
}
