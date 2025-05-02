import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  JwtPayload,
  JwtResponse,
  LoginUserDto,
  RegisterUserDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private bcryptService: BcryptService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  private async generateBearerToken({
    identifier,
    email,
  }: User): Promise<JwtResponse> {
    const payload: JwtPayload = { sub: identifier, email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: RegisterUserDto): Promise<JwtResponse> {
    const { email, plainPassword } = data;

    const user = await this.prismaService.user.create({
      data: {
        email,
        hashedPassword: await this.bcryptService.hashPassword(plainPassword),
      },
    });

    const jwtResponse = await this.generateBearerToken(user);

    return jwtResponse;
  }

  async login(data: LoginUserDto): Promise<JwtResponse> {
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

    const jwtResponse = await this.generateBearerToken(user);

    return jwtResponse;
  }

  async findFirst(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
