import { Injectable } from '@nestjs/common';
import { Prisma, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService) {}

  async findMessages(channel: string) {
    const messages = await this.prismaService.message.findMany({
      where: {
        channel,
      },
      include: {
        fromUser: {
          omit: { hashedPassword: true },
        },
      },
    });

    return messages;
  }

  async createMessage(data: Prisma.MessageCreateInput): Promise<Message> {
    return await this.prismaService.message.create({
      data,
    });
  }
}
