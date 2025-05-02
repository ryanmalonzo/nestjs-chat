import { Injectable } from '@nestjs/common';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, CreateUserResponseDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private bcrypt: BcryptService,
    private prisma: PrismaService,
  ) {}

  async createUser(data: CreateUserDto): Promise<CreateUserResponseDto> {
    const { email, plainPassword } = data;

    return this.prisma.user.create({
      data: {
        email,
        hashedPassword: await this.bcrypt.hashPassword(plainPassword),
      },
    });
  }
}
