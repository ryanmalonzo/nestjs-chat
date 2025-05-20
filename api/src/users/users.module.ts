import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DocumentsService } from 'src/documents/documents.service';

@Module({
  providers: [UsersService, DocumentsService],
  controllers: [UsersController],
})
export class UsersModule {}
