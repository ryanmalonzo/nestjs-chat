import { Module } from '@nestjs/common';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [BcryptModule, PrismaModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
