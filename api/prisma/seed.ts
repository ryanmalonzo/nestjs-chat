import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../src/bcrypt/bcrypt.service';

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const email = 'esgi@esgi.fr';
  const hashedPassword = await bcrypt.hash('password', SALT_ROUNDS);

  const defaultUser = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      username: email,
      email,
      hashedPassword,
    },
  });
  console.log('Default user created:', defaultUser);

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
