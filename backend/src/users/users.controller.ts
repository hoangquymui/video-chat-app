import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

type CreateUserDto = {
  name: string;
  email: string;
  password: string;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
