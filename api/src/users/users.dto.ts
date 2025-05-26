import { ApiProperty } from '@nestjs/swagger';
import { ChatBubbleColor, User } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class PartialUserDto implements Partial<Omit<User, 'hashedPassword'>> {
  @ApiProperty({ description: 'User identifier (UUID)' })
  @IsOptional()
  identifier?: string;

  @ApiProperty({ description: 'Username' })
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'User email' })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Profile picture URL' })
  @IsOptional()
  profilePictureUrl?: string | null;

  @ApiProperty({ description: 'Chat bubble color', enum: ChatBubbleColor })
  @IsOptional()
  chatBubbleColor?: ChatBubbleColor;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @IsOptional()
  updatedAt?: Date;
}

export class UploadUrlResponseDto {
  @ApiProperty({
    description: 'The URL to upload the profile picture',
    example: 'https://example.com/upload/12345',
  })
  url: string;
}
