import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entity/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  create(createRoomDto: CreateRoomDto, userId: number) {
    const room = this.roomsRepository.create({
      name: createRoomDto.name,
      memberIds: createRoomDto.memberIds,
      createdBy: userId,
    });

    return this.roomsRepository.save(room);
  }
  async update(id: number, data: { name?: string }) {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy nhóm');
    }

    Object.assign(room, data);

    return this.roomsRepository.save(room);
  }

  async remove(id: number) {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy nhóm');
    }

    await this.roomsRepository.remove(room);

    return {
      message: 'Xoá nhóm thành công',
      id,
    };
  }

  findMyRooms(userId: number) {
    return this.roomsRepository
      .createQueryBuilder('room')
      .where('room.createdBy = :userId', { userId })
      .orWhere('JSON_CONTAINS(room.memberIds, :userIdJson)', {
        userIdJson: JSON.stringify(userId),
      })
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }
}
