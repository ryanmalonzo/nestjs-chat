import { Injectable } from '@nestjs/common';
import { Message, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMessages(channelName: string) {
    const messages = await this.prismaService.message.findMany({
      where: {
        channel: { name: channelName },
      },
      include: {
        fromUser: {
          omit: { hashedPassword: true },
        },
        channel: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }

  async createMessage(
    content: string,
    channelName: string,
    user: User,
  ): Promise<Message> {
    return await this.prismaService.message.create({
      data: {
        content,
        channel: { connect: { name: channelName } },
        fromUser: {
          connect: user,
        },
      },
      include: {
        fromUser: {
          omit: { hashedPassword: true },
        },
        channel: true,
      },
    });
  }
}
