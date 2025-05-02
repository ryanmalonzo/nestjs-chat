import { User } from '@prisma/client';

export class PartialUserDto implements Partial<User> {
  identifier: string;
  email: string;
}
