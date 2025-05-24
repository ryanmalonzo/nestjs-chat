import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { ChannelsModule } from './channels/channels.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    BcryptModule,
    ChannelsModule,
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ChatModule,
    UsersModule,
    MessagesModule,
    ChannelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
