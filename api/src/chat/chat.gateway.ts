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
import { AuthService } from 'src/auth/auth.service';
import { MessagesService } from 'src/messages/messages.service';
import { ChannelMessageDto, SocketWithUserDto } from './chat.dto';

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
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @MessageBody() channel: string,
    @ConnectedSocket() client: SocketWithUserDto,
  ) {
    await client.join(channel);
    this.logger.log(`${client.user.email} joined channel ${channel}`);
    return { success: true };
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: ChannelMessageDto,
    @ConnectedSocket() client: SocketWithUserDto,
  ) {
    if (!data.content || !data.channel) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.findUserByEmail(client.user.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const createdMessage = await this.messagesService.createMessage(
      data.content,
      data.channel,
      user,
    );

    this.server.to(data.channel).emit('message', createdMessage);
    this.logger.log(`${client.user.email} in ${data.channel}: ${data.content}`);

    return createdMessage;
  }
}
