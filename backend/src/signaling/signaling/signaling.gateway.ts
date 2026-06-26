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
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    const roomId = client.data.roomId;

    if (roomId) {
      client.to(roomId).emit('user-left', {
        from: client.id,
      });
    }
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
    client.data.roomId = roomId;
    client.data.user = user;

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
    client.leave(data.roomId);

    client.to(data.roomId).emit('user-left', {
      from: client.id,
    });

    client.data.roomId = null;
    client.data.user = null;

    console.log(`Client ${client.id} left room ${data.roomId}`);
  }
}
