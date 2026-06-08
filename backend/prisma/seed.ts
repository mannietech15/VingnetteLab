import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 'usr_1' },
    update: {},
    create: {
      id: 'usr_1',
      email: 'test@vignettelab.com',
      password: 'hashed_password_placeholder',
      name: 'Test User',
    },
  });

  console.log('Seeded default user:', user);
  await prisma.$disconnect();
}

main();
