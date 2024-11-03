import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  // Create some sample posts
  const posts = [
    {
      title: 'Getting Started with React and TypeScript',
      content: 'React and TypeScript are a powerful combination for building web applications...',
      published: true,
      authorId: demoUser.id,
    },
    {
      title: 'Understanding Modern Web Development',
      content: 'The landscape of web development has evolved significantly over the years...',
      published: true,
      authorId: demoUser.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });