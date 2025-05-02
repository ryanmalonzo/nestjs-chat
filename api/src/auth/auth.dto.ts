import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { IsEmail, IsString, IsUUID } from 'class-validator';

export class RegisterUserDto implements Partial<Prisma.UserCreateInput> {
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

export class LoginUserDto implements Partial<User> {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The plain password of the user',
    example: 'SuperSecurePassword123!',
  })
  @IsString()
  plainPassword: string;
}

export class JwtPayload {
  @IsUUID()
  sub: string;

  @IsEmail()
  email: string;
}

export class JwtResponse {
  @ApiProperty({
    description: 'The bearer token of the user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTM5N2JiZS1mMTcxLTRhNWUtYmI0Yi1lZWFiYjhjMjc5YmQiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ2MTgyNTk1LCJleHAiOjE3NDYyNjg5OTV9.InicOMknB7yzl1FvI4S6ffhnrrVo5ZX0wYuI4098i9M',
  })
  @IsString()
  accessToken: string;
}
