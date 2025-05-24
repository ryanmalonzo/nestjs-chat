import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayloadDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PartialUserDto, UploadUrlResponseDto } from './users.dto';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  private readonly s3Client: S3Client;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    const s3Config: S3ClientConfig = {
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
      region: this.configService.getOrThrow<string>('S3_REGION'),
    };
    this.s3Client = new S3Client(s3Config);
  }

  async me(): Promise<PartialUserDto> {
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

    return user;
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

  async getProfilePictureUploadUrl(
    fileExtension: string,
  ): Promise<UploadUrlResponseDto> {
    if (!('user' in this.request)) {
      throw new UnauthorizedException();
    }

    const { sub: identifier } = this.request.user as JwtPayloadDto;
    const bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const s3Endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');

    const key = `${identifier}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `${bucket}/${key}`,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5, // 5 minutes
    });

    // Update user's profilePictureUrl immediately
    const profilePictureUrl = `${s3Endpoint}/${bucket}/${key}`;
    await this.prismaService.user.update({
      where: { identifier },
      data: { profilePictureUrl },
    });

    return { url };
  }
}
