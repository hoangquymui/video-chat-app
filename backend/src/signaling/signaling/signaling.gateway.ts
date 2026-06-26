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
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;

    client.join(roomId);
    client.data.roomId = roomId;

    client.to(roomId).emit('user-joined', {
      from: client.id,
    });

    console.log(`Client ${client.id} joined room ${roomId}`);

    return {
      socketId: client.id,
      roomId,
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

    console.log(`Client ${client.id} left room ${data.roomId}`);
  }
}
