import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entity/conversation.entity';
import { Message } from './entity/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findOrCreateDirectConversation(
    currentUserId: number,
    otherUserId: number,
  ) {
    let conversation = await this.conversationRepository.findOne({
      where: [
        {
          userAId: currentUserId,
          userBId: otherUserId,
        },
        {
          userAId: otherUserId,
          userBId: currentUserId,
        },
      ],
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        userAId: currentUserId,
        userBId: otherUserId,
      });

      conversation = await this.conversationRepository.save(conversation);
    }

    return conversation;
  }

  findMyConversations(currentUserId: number) {
    return this.conversationRepository.find({
      where: [
        {
          userAId: currentUserId,
        },
        {
          userBId: currentUserId,
        },
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findMessages(conversationId: number) {
    return this.messageRepository.find({
      where: {
        conversationId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async createMessage(
    conversationId: number,
    senderId: number,
    content: string,
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện');
    }

    const message = this.messageRepository.create({
      conversationId,
      senderId,
      content,
    });

    return this.messageRepository.save(message);
  }
}
