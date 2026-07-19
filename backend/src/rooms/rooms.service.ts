import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomMember } from './entity/room-member.entity';
import { Room } from './entity/room.entity';

type DeleteRoomResult = {
  message: string;
  id: number;
};

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,

    @InjectRepository(RoomMember)
    private readonly roomMembersRepository: Repository<RoomMember>,
  ) {}

  async create(
    createRoomDto: CreateRoomDto,
    userId: number,
  ): Promise<Room | null> {
    const room = this.roomsRepository.create({
      name: createRoomDto.name,
      createdBy: userId,
    });

    const savedRoom = await this.roomsRepository.save(room);

    const uniqueMemberIds = Array.from(
      new Set([userId, ...createRoomDto.memberIds]),
    );

    const members = uniqueMemberIds.map((memberId) =>
      this.roomMembersRepository.create({
        roomId: savedRoom.id,
        userId: memberId,
        role: memberId === userId ? 'owner' : 'member',
      }),
    );

    await this.roomMembersRepository.save(members);

    return this.findById(savedRoom.id);
  }

  private async findOrCreateDirectRoomLegacy(
    currentUserId: number,
    otherUserId: number,
    currentUserName: string,
  ): Promise<Room | null> {
    if (currentUserId === otherUserId) {
      throw new NotFoundException('Không thể tự gọi chính mình');
    }

    const directKey = [currentUserId, otherUserId].sort((a, b) => a - b).join(':');
    const existing = await this.roomsRepository.findOne({
      where: { directKey },
      relations: { members: true },
    });
    if (existing) return existing;

    const room = this.roomsRepository.create({
      name: `Cuộc gọi của ${currentUserName}`,
      createdBy: currentUserId,
      directKey,
    });
    const savedRoom = await this.roomsRepository.save(room);
    await this.roomMembersRepository.save([
      this.roomMembersRepository.create({ roomId: savedRoom.id, userId: currentUserId, role: 'owner' }),
      this.roomMembersRepository.create({ roomId: savedRoom.id, userId: otherUserId, role: 'member' }),
    ]);
    return this.findById(savedRoom.id);
  }

  async findOrCreateDirectRoom(
    currentUserId: number,
    otherUserId: number,
    currentUserName: string,
  ): Promise<Room | null> {
    if (currentUserId === otherUserId) {
      throw new NotFoundException('Không thể tự gọi chính mình');
    }

    const directKey = [currentUserId, otherUserId].sort((a, b) => a - b).join(':');
    const existing = await this.roomsRepository.findOne({
      where: { directKey },
      relations: { members: true },
    });
    if (existing) return existing;

    const room = this.roomsRepository.create({
      name: `Cuộc gọi của ${currentUserName}`,
      createdBy: currentUserId,
      directKey,
    });
    const savedRoom = await this.roomsRepository.save(room);
    await this.roomMembersRepository.save([
      this.roomMembersRepository.create({ roomId: savedRoom.id, userId: currentUserId, role: 'owner' }),
      this.roomMembersRepository.create({ roomId: savedRoom.id, userId: otherUserId, role: 'member' }),
    ]);
    return this.findById(savedRoom.id);
  }

  findById(id: number): Promise<Room | null> {
    return this.roomsRepository.findOne({
      where: { id },
      relations: {
        members: true,
      },
      order: {
        members: {
          joinedAt: 'ASC',
        },
      },
    });
  }

  findMyRooms(userId: number): Promise<Room[]> {
    return this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.members', 'member')
      .where('room.createdBy = :userId', { userId })
      .orWhere('member.userId = :userId', { userId })
      .orderBy('room.createdAt', 'DESC')
      .getMany();
  }

  findAll(): Promise<Room[]> {
    return this.roomsRepository.find({
      relations: {
        members: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async update(id: number, data: { name?: string }): Promise<Room | null> {
    const room = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy nhóm');
    }

    Object.assign(room, data);

    await this.roomsRepository.save(room);

    return this.findById(id);
  }

  async remove(id: number): Promise<DeleteRoomResult> {
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

  async addMember(roomId: number, userId: number): Promise<Room | null> {
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy nhóm');
    }

    const existed = await this.roomMembersRepository.findOne({
      where: { roomId, userId },
    });

    if (existed) {
      return this.findById(roomId);
    }

    const member = this.roomMembersRepository.create({
      roomId,
      userId,
      role: 'member',
    });

    await this.roomMembersRepository.save(member);

    return this.findById(roomId);
  }

  async removeMember(roomId: number, userId: number): Promise<Room | null> {
    const member = await this.roomMembersRepository.findOne({
      where: { roomId, userId },
    });

    if (!member) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }

    await this.roomMembersRepository.remove(member);

    return this.findById(roomId);
  }
}
