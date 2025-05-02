import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { PartialUserDto } from './users.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayloadDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private prismaService: PrismaService,
  ) {}

  async me(): Promise<PartialUserDto> {
    if (!('user' in this.request)) {
      throw new UnauthorizedException();
    }

    const { sub: identifier } = this.request.user as JwtPayloadDto;

    const user = await this.prismaService.user.findUnique({
      where: { identifier },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { email } = user;

    return { identifier, email };
  }
}
