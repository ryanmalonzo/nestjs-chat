import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PartialUserDto implements Omit<User, 'hashedPassword'> {
  @ApiProperty({ description: 'User identifier (UUID)' })
  identifier: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
