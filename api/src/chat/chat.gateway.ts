import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import { JwtPayloadDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { WsAuthGuard } from 'src/auth/ws-auth.guard';
import { WsAuthMiddleware } from 'src/auth/ws-auth.middleware';
import { WsUser } from 'src/auth/ws-user.decorator';
import { MessagesService } from 'src/messages/messages.service';
import { ChannelMessageDto } from './chat.dto';

@WebSocketGateway({
  allowUpgrades: false,
  cors: {
    allowedHeaders: ['authorization'],
    credentials: true,
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
  transports: ['polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('ChatGateway');

  constructor(
    private readonly authService: AuthService,
    private readonly messagesService: MessagesService,
    private readonly wsAuthMiddleware: WsAuthMiddleware,
  ) {}

  async handleConnection(client: Socket) {
    try {
      await this.wsAuthMiddleware.authenticateSocket(client);
      this.logger.log(`Client connected: ${client.id}`);
    } catch {
      this.logger.warn(`Client connection rejected: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @MessageBody() channel: string,
    @ConnectedSocket() client: Socket,
    @WsUser() user: JwtPayloadDto,
  ) {
    await client.join(channel);
    this.logger.log(`${user.email} joined channel ${channel}`);
    return { success: true };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: ChannelMessageDto,
    @WsUser() user: JwtPayloadDto,
  ) {
    if (!data.content || !data.channel) {
      throw new UnauthorizedException();
    }

    const dbUser = await this.authService.findUserByEmail(user.email);
    if (!dbUser) {
      throw new UnauthorizedException();
    }

    const createdMessage = await this.messagesService.createMessage(
      data.content,
      data.channel,
      dbUser,
    );

    this.server.to(data.channel).emit('message', createdMessage);
    this.logger.log(`${user.email} in ${data.channel}: ${data.content}`);

    return createdMessage;
  }
}
