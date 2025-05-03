import { User } from '@prisma/client';

export type PartialUserDto = Omit<User, 'hashedPassword'>;
