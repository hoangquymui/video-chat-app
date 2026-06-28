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
  roomId: string;
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
    const roomId = client.data.roomId as string | undefined;

    if (!roomId) return;

    const users = this.callUsers.get(roomId);

    if (users) {
      users.delete(client.id);

      this.server.to(roomId).emit('room-users', {
        users: Array.from(users.values()),
      });

      if (users.size === 0) {
        this.callUsers.delete(roomId);
      }
    }
  }

  @SubscribeMessage('join-room-preview')
  handleJoinRoomPreview(
    @MessageBody() data: { roomId: string; user: SocketUser },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, user } = data;

    if (!this.previewUsers.has(roomId)) {
      this.previewUsers.set(roomId, new Map());
    }

    this.previewUsers.get(roomId)!.set(client.id, user);

    client.data.previewRoomId = roomId;
    client.data.user = user;

    client.join(`preview-${roomId}`);

    this.server.to(`preview-${roomId}`).emit('call-users', {
      users: Array.from(this.callUsers.get(roomId)?.values() ?? []),
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody()
    data: {
      roomId: string;
      user: SocketUser;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, user } = data;

    client.join(roomId);

    if (!this.callUsers.has(roomId)) {
      this.callUsers.set(roomId, new Map());
    }

    this.callUsers.get(roomId)!.set(client.id, user);

    client.data.roomId = roomId;
    client.data.user = user;

    this.server.to(`preview-${roomId}`).emit('call-users', {
      users: Array.from(this.callUsers.get(roomId)!.values()),
    });

    client.to(roomId).emit('user-joined', {
      from: client.id,
      user,
    });

    console.log(`Client ${client.id} joined room ${roomId}`);

    return {
      socketId: client.id,
      roomId,
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
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;

    const users = this.callUsers.get(roomId);

    if (users) {
      users.delete(client.id);

      const currentUsers = Array.from(users.values());

      this.server.to(`preview-${roomId}`).emit('call-users', {
        users: currentUsers,
      });

      client.emit('call-users', {
        users: currentUsers,
      });

      if (users.size === 0) {
        this.callUsers.delete(roomId);
      }
    }

    client.to(roomId).emit('user-left', {
      from: client.id,
    });

    client.leave(roomId);
    client.data.roomId = null;

    console.log(`Client ${client.id} left room ${roomId}`);
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
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room-chat-${data.roomId}`);
  }

  @SubscribeMessage('send-room-message')
  handleSendRoomMessage(
    @MessageBody()
    data: {
      roomId: number;
      message: {
        id: number;
        roomId: number;
        senderId: number;
        content: string;
        createdAt: string;
      };
    },
  ) {
    this.server
      .to(`room-chat-${data.roomId}`)
      .emit('new-room-message', data.message);
  }
}
