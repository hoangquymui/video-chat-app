import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

type AuthRequest = Request & {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
};

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('direct/:userId')
  findOrCreateDirectConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: AuthRequest,
  ) {
    return this.chatService.findOrCreateDirectConversation(req.user.id, userId);
  }

  @Get('conversations')
  findMyConversations(@Req() req: AuthRequest) {
    return this.chatService.findMyConversations(req.user.id);
  }

  @Get('conversations/:conversationId/messages')
  findMessages(@Param('conversationId', ParseIntPipe) conversationId: number) {
    return this.chatService.findMessages(conversationId);
  }

  @Post('conversations/:conversationId/messages')
  createMessage(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() body: CreateMessageDto,
    @Req() req: AuthRequest,
  ) {
    return this.chatService.createMessage(
      conversationId,
      req.user.id,
      body.content,
    );
  }
}
