import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from './entity/meeting.entity';
import { Message } from 'src/chat/entity/message.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingsRepository: Repository<Meeting>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(
    createMeetingDto: CreateMeetingDto,
    userId: number,
  ): Promise<Meeting> {
    const activeMeeting = await this.meetingsRepository.findOne({
      where: {
        roomId: createMeetingDto.roomId,
        status: 'active',
      },
    });

    if (activeMeeting) {
      return activeMeeting;
    }

    const totalMeeting = await this.meetingsRepository.count({
      where: {
        roomId: createMeetingDto.roomId,
      },
    });

    const meetingCode = `R${createMeetingDto.roomId}-M${totalMeeting + 1}`;

    const meeting = this.meetingsRepository.create({
      roomId: createMeetingDto.roomId,
      meetingCode,
      startedBy: userId,
      status: 'active',
      endedAt: null,
    });

    return this.meetingsRepository.save(meeting);
  }

  findById(id: number): Promise<Meeting | null> {
    return this.meetingsRepository.findOne({
      where: { id },
    });
  }

  findByRoom(roomId: number): Promise<Meeting[]> {
    return this.meetingsRepository.find({
      where: { roomId },
      order: {
        startedAt: 'DESC',
      },
    });
  }

  async end(id: number): Promise<Meeting> {
    const meeting = await this.findById(id);

    if (!meeting) {
      throw new NotFoundException('Không tìm thấy cuộc họp');
    }

    meeting.status = 'ended';
    meeting.endedAt = new Date();

    await this.messageRepository.delete({
      meetingCode: meeting.meetingCode,
    });

    return this.meetingsRepository.save(meeting);
  }

  findByCode(meetingCode: string) {
    return this.meetingsRepository.findOne({
      where: {
        meetingCode,
      },
    });
  }
}
