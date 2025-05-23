import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../src/bcrypt/bcrypt.service';

const prisma = new PrismaClient();

async function main() {
  // Create default users
  const defaultUsers = [
    {
      username: 'esgi1',
      email: 'esgi1@myges.fr',
      hashedPassword: await bcrypt.hash('esgi1', SALT_ROUNDS),
    },
    {
      username: 'esgi2',
      email: 'esgi2@myges.fr',
      hashedPassword: await bcrypt.hash('esgi2', SALT_ROUNDS),
    },
  ];

  for (const user of defaultUsers) {
    const { username, email, hashedPassword } = user;
    const createdUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        username,
        email,
        hashedPassword,
      },
    });
    console.log('Default user created:', createdUser);
  }

  // Create default channels
  const defaultChannels = ['general', 'food', 'random'];
  for (const channelName of defaultChannels) {
    const channel = await prisma.channel.upsert({
      where: { name: channelName },
      update: {},
      create: {
        name: channelName,
      },
    });
    console.log('Default channel created:', channel);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
