import { Test, TestingModule } from '@nestjs/testing';
import { SignalingGateway } from './signaling.gateway';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { ChatService } from '../../chat/chat.service';

describe('SignalingGateway', () => {
  let gateway: SignalingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalingGateway,
        { provide: JwtService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: ChatService, useValue: {} },
      ],
    }).compile();

    gateway = module.get<SignalingGateway>(SignalingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
