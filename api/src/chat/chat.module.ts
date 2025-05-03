import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthService } from 'src/auth/auth.service';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  providers: [ChatGateway, AuthService, MessagesService],
})
export class ChatModule {}
