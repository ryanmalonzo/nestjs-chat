import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [DocumentsService],
  controllers: [DocumentsController],
  imports: [PrismaModule],
})
export class DocumentsModule {}
