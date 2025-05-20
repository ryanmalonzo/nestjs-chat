import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PartialUserDto implements Partial<Omit<User, 'hashedPassword'>> {
  @ApiProperty({ description: 'User identifier (UUID)' })
  @IsOptional()
  identifier: string;

  @ApiProperty({ description: 'Username' })
  @IsOptional()
  username: string;

  @ApiProperty({ description: 'User email' })
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @IsOptional()
  updatedAt: Date;
}

export class PartialUserWithProfilePictureDto extends PartialUserDto {
  @ApiProperty({ description: 'Profile picture URL' })
  @IsOptional()
  profilePictureUrl?: string;
}
