import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(data: CreateUserInput) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({
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
}
