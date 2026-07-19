import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling/signaling.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [AuthModule, UsersModule, ChatModule],
  providers: [SignalingGateway],
})
export class SignalingModule {}
