import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { hashPassword } from '../auth/password';

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private toPublicUser(user: User): PublicUser {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
      role: createUserDto.role ?? 'user',
    });

    const savedUser = await this.usersRepository.save(user);
    return this.toPublicUser(savedUser);
  }

  findAll() {
    return this.usersRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  findById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, _actorId?: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    if (user.role === 'admin' && updateUserDto.role === 'user') {
      await this.ensureAnotherAdminExists(id);
    }

    Object.assign(user, {
      ...updateUserDto,
      ...(updateUserDto.password
        ? { password: await hashPassword(updateUserDto.password) }
        : {}),
    });

    const savedUser = await this.usersRepository.save(user);
    return this.toPublicUser(savedUser);
  }

  async upgradePasswordHash(id: number, password: string) {
    await this.usersRepository.update(id, {
      password: await hashPassword(password),
    });
  }

  async remove(id: number, _actorId?: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    if (user.role === 'admin') await this.ensureAnotherAdminExists(id);

    await this.usersRepository.remove(user);

    return {
      message: 'Xoá user thành công',
      id,
    };
  }

  private async ensureAnotherAdminExists(excludedId: number) {
    const otherAdmins = await this.usersRepository.count({
      where: { role: 'admin', id: Not(excludedId) },
    });
    if (otherAdmins === 0) {
      throw new BadRequestException('Hệ thống phải còn ít nhất một admin');
    }
  }

  findChatUsers(currentUserId: number) {
    return this.usersRepository.find({
      where: {
        id: Not(currentUserId),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
