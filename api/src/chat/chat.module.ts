import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { WsAuthGuard } from 'src/auth/ws-auth.guard';
import { WsAuthMiddleware } from 'src/auth/ws-auth.middleware';
import { MessagesService } from 'src/messages/messages.service';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [
    ChatGateway,
    AuthService,
    MessagesService,
    WsAuthMiddleware,
    WsAuthGuard,
  ],
})
export class ChatModule {}
