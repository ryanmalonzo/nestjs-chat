import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export const SALT_ROUNDS = 10;

@Injectable()
export class BcryptService {
  async hashPassword(plainPassword: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashedPassword;
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const compare = await bcrypt.compare(plainPassword, hashedPassword);
    return compare;
  }
}
