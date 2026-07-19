import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const entries = await prisma.journalEntry.findMany({
    select: {
      id: true,
      title: true,
      visibility: true,
      isDraft: true,
      authorId: true,
    }
  });
  console.log('All Entries in DB:', JSON.stringify(entries, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
