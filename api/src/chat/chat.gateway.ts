import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import { MessagesService } from 'src/messages/messages.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  allowUpgrades: false,
  cors: {
    allowedHeaders: 'authorization',
    credentials: true,
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
  transports: ['polling'],
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly authService: AuthService,
    private readonly messagesService: MessagesService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log('Client connected', client.id);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('general')
  async handleMessage(
    @MessageBody() content: string,
    @ConnectedSocket() client: SocketWithUserDto,
  ) {
    if (!content) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.findUserByEmail(client.user.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const createdMessage = await this.messagesService.createMessage({
      channel: 'general',
      content: content,
      fromUser: {
        connect: user,
      },
    });
    this.server.emit('general', createdMessage);

    this.logger.log(`${client.user.email}: ${content}`);

    return createdMessage;
  }
}
