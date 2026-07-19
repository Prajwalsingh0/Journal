import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const entries = await prisma.journalEntry.findMany({
    select: {
      id: true,
      title: true,
      tags: true,
    }
  });
  console.log('Entries and tags:');
  entries.forEach(e => {
    console.log(`- Title: "${e.title}", Tags: ${e.tags}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
