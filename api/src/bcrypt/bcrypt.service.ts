import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

@Injectable()
export class BcryptService {
  async hashPassword(plainPassword: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashedPassword;
  }
}
