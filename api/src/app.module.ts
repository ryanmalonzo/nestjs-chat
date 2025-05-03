import { Module } from '@nestjs/common';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    AuthModule,
    BcryptModule,
    ChatModule,
    ConfigModule.forRoot(),
    PrismaModule,
    ChatModule,
    UsersModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
