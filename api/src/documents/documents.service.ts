import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { JwtPayloadDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { UploadUrlResponseType } from './documents.dto';

@Injectable()
export class DocumentsService {
  private readonly s3Client: S3Client;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    const s3Config: S3ClientConfig = {
      credentials: {
        accessKeyId: this.configService.getOrThrow('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
      },
      endpoint: this.configService.getOrThrow('S3_ENDPOINT'),
      region: this.configService.getOrThrow('S3_REGION'),
    };
    this.s3Client = new S3Client(s3Config);
  }

  async getUploadUrl(type: string): Promise<UploadUrlResponseType> {
    if (!('user' in this.request)) {
      throw new UnauthorizedException();
    }

    const bucket = this.configService.getOrThrow('S3_BUCKET');

    const key = `${bucket}/${type}/${randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5, // 5 minutes
    });

    const { sub: identifier } = this.request.user as JwtPayloadDto;

    await this.prismaService.document.create({
      data: {
        userIdentifier: identifier,
        type,
        key,
      },
    });

    return { url };
  }
}
