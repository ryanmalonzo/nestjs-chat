import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getChannels(): Promise<Channel[]> {
    return await this.prismaService.channel.findMany();
  }
}
