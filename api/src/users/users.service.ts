import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayloadDto } from 'src/auth/auth.dto';
import { DocumentsService } from 'src/documents/documents.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PartialUserDto, PartialUserWithProfilePictureDto } from './users.dto';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly prismaService: PrismaService,
    private readonly documentsService: DocumentsService,
  ) {}

  async me(): Promise<PartialUserWithProfilePictureDto> {
    if (!('user' in this.request)) {
      throw new UnauthorizedException();
    }

    const { sub: identifier } = this.request.user as JwtPayloadDto;

    const user = await this.prismaService.user.findUnique({
      where: { identifier },
      omit: { hashedPassword: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Check if the user has a profile picture
    const profilePicture = await this.prismaService.document.findFirst({
      where: {
        userIdentifier: identifier,
        type: 'profile-pictures',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!profilePicture) {
      return user;
    }

    const profilePictureUrl = await this.documentsService.getFileUrl(
      profilePicture.key,
    );

    return { ...user, profilePictureUrl };
  }

  async updateUser(data: PartialUserDto): Promise<PartialUserDto> {
    if (!('user' in this.request)) {
      throw new UnauthorizedException();
    }

    const { sub: requestUserIdentifier } = this.request.user as JwtPayloadDto;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, createdAt, updatedAt, ...rest } = data;

    const user = await this.prismaService.user.update({
      where: { identifier: requestUserIdentifier },
      data: rest,
      omit: { hashedPassword: true },
    });

    return user;
  }
}
