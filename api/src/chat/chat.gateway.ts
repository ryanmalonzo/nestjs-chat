import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { SocketWithUserDto } from './chat.dto';

@WebSocketGateway({
  allowUpgrades: false,
  cors: {
    allowedHeaders: 'authorization',
    credentials: true,
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('general')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: SocketWithUserDto,
  ): void {
    console.log(`${client.user.email}: ${message}`);
  }
}
