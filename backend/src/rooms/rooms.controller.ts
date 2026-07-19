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
import { AdminGuard } from '../auth/admin.guard';

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

  @Post('direct-legacy/:userId')
  findOrCreateDirectRoomLegacy(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: AuthRequest,
  ) {
    return this.roomsService.findOrCreateDirectRoom(
      req.user.id,
      userId,
      req.user.name,
    );
  }

  @Post('direct/:userId')
  findOrCreateDirectRoom(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: AuthRequest,
  ) {
    return this.roomsService.findOrCreateDirectRoom(
      req.user.id,
      userId,
      req.user.name,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.roomsService.findAll();
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string },
  ) {
    return this.roomsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }

  @Post(':roomId/members/:userId')
  @UseGuards(AdminGuard)
  addMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.roomsService.addMember(roomId, userId);
  }

  @Delete(':roomId/members/:userId')
  @UseGuards(AdminGuard)
  removeMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.roomsService.removeMember(roomId, userId);
  }
}
