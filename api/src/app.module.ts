import { Module } from '@nestjs/common';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BcryptModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
