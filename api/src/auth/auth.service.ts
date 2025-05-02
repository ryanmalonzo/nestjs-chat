import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  LoginUserDto,
  RegisterUserDto,
  RegisterUserResponseDto,
} from './auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private bcryptService: BcryptService,
    private prismaService: PrismaService,
  ) {}

  async register(data: RegisterUserDto): Promise<RegisterUserResponseDto> {
    const { email, plainPassword } = data;

    return this.prismaService.user.create({
      data: {
        email,
        hashedPassword: await this.bcryptService.hashPassword(plainPassword),
      },
    });
  }

  async login(data: LoginUserDto): Promise<any> {
    const { email, plainPassword } = data;

    const user = await this.findFirst(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (
      !(await this.bcryptService.compare(plainPassword, user.hashedPassword))
    ) {
      throw new UnauthorizedException();
    }

    const { hashedPassword, ...result } = user;

    // TODO: Generate a JWT and return it here
    // instead of the user object

    return result;
  }

  async findFirst(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
