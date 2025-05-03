import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  JwtPayloadDto,
  JwtResponseDto,
  LoginUserDto,
  RegisterUserDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  private async generateBearerToken({
    identifier,
    email,
  }: User): Promise<JwtResponseDto> {
    const payload: JwtPayloadDto = { sub: identifier, email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(data: RegisterUserDto): Promise<JwtResponseDto> {
    const { email, plainPassword } = data;

    let user;
    try {
      user = await this.prismaService.user.create({
        data: {
          email,
          hashedPassword: await this.bcryptService.hashPassword(plainPassword),
        },
      });
    } catch {
      throw new BadRequestException();
    }

    const jwtResponse = await this.generateBearerToken(user);

    return jwtResponse;
  }

  async login(data: LoginUserDto): Promise<JwtResponseDto> {
    const { email, plainPassword } = data;

    const user = await this.findUnique(email);
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

  async findUnique(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }
}
