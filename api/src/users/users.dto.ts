import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateUserDto implements Partial<Prisma.UserCreateInput> {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The plain password of the user',
    example: 'SuperSecurePassword123!',
  })
  plainPassword: string;
}

export class CreateUserResponseDto implements Partial<CreateUserDto> {
  @ApiProperty({
    description: 'The identifier (UUID) of the user',
    example: '69a55e21-8851-4393-b937-9d207bbe3003',
  })
  @IsUUID()
  identifier: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  email: string;
}
