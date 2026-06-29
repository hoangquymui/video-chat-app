import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type SocketUser = {
  id: number;
  name: string;
};

type SignalPayload = {
  meetingCode: string;
  to?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

@WebSocketGateway({
  cors: {
    origin: [
      'https://localhost:5174',
      'https://192.168.2.138:5174',
      'http://localhost:5174',
      'http://192.168.2.138:5174',
    ],
    credentials: true,
  },
})
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private previewUsers = new Map<string, Map<string, SocketUser>>();
  private callUsers = new Map<string, Map<string, SocketUser>>();

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const meetingCode = client.data.meetingCode as string | undefined;

    if (!meetingCode) return;

    const users = this.callUsers.get(meetingCode);

    if (users) {
      users.delete(client.id);

      this.server.to(meetingCode).emit('room-users', {
        users: Array.from(users.values()),
      });

      if (users.size === 0) {
        this.callUsers.delete(meetingCode);
      }
    }
  }

  @SubscribeMessage('join-room-preview')
  handleJoinRoomPreview(
    @MessageBody() data: { meetingCode: string; user: SocketUser },
    @ConnectedSocket() client: Socket,
  ) {
    const { meetingCode, user } = data;

    if (!this.previewUsers.has(meetingCode)) {
      this.previewUsers.set(meetingCode, new Map());
    }

    this.previewUsers.get(meetingCode)!.set(client.id, user);

    client.data.previewmeetingCode = meetingCode;
    client.data.user = user;

    client.join(`preview-${meetingCode}`);

    this.server.to(`preview-${meetingCode}`).emit('call-users', {
      users: Array.from(this.callUsers.get(meetingCode)?.values() ?? []),
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody()
    data: {
      meetingCode: string;
      user: SocketUser;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { meetingCode, user } = data;

    client.join(meetingCode);

    if (!this.callUsers.has(meetingCode)) {
      this.callUsers.set(meetingCode, new Map());
    }

    this.callUsers.get(meetingCode)!.set(client.id, user);

    client.data.meetingCode = meetingCode;
    client.data.user = user;

    this.server.to(`preview-${meetingCode}`).emit('call-users', {
      users: Array.from(this.callUsers.get(meetingCode)!.values()),
    });

    client.to(meetingCode).emit('user-joined', {
      from: client.id,
      user,
    });

    console.log(`Client ${client.id} joined room ${meetingCode}`);

    return {
      socketId: client.id,
      meetingCode,
      user,
    };
  }

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() data: SignalPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.to!).emit('offer', {
      from: client.id,
      offer: data.offer,
      user: client.data.user,
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody() data: SignalPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.to!).emit('answer', {
      from: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('candidate')
  handleCandidate(
    @MessageBody() data: SignalPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.to!).emit('candidate', {
      from: client.id,
      candidate: data.candidate,
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { meetingCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { meetingCode } = data;

    const users = this.callUsers.get(meetingCode);

    if (users) {
      users.delete(client.id);

      const currentUsers = Array.from(users.values());

      this.server.to(`preview-${meetingCode}`).emit('call-users', {
        users: currentUsers,
      });

      client.emit('call-users', {
        users: currentUsers,
      });

      if (users.size === 0) {
        this.callUsers.delete(meetingCode);
      }
    }

    client.to(meetingCode).emit('user-left', {
      from: client.id,
    });

    client.leave(meetingCode);
    client.data.meetingCode = null;

    console.log(`Client ${client.id} left room ${meetingCode}`);
  }

  @SubscribeMessage('join-conversation')
  handleJoinConversation(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`conversation-${data.conversationId}`);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(
    @MessageBody()
    data: {
      conversationId: number;
      message: {
        id: number;
        conversationId: number;
        senderId: number;
        content: string;
        createdAt: string;
      };
    },
  ) {
    this.server
      .to(`conversation-${data.conversationId}`)
      .emit('new-message', data.message);
  }

  @SubscribeMessage('join-room-chat')
  handleJoinRoomChat(
    @MessageBody() data: { meetingCode: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room-chat-${data.meetingCode}`);
  }

  @SubscribeMessage('send-room-message')
  handleSendRoomMessage(
    @MessageBody()
    data: {
      meetingCode: number;
      message: {
        id: number;
        meetingCode: number;
        senderId: number;
        content: string;
        createdAt: string;
      };
    },
  ) {
    this.server
      .to(`room-chat-${data.meetingCode}`)
      .emit('new-room-message', data.message);
  }
}
