import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all tables in public schema...');
  const tables: Array<{ tablename: string }> = await prisma.$queryRaw`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public';
  `;

  console.log(`Found ${tables.length} tables:`, tables.map(t => t.tablename));

  for (const table of tables) {
    const tableName = table.tablename;
    console.log(`Enabling Row-Level Security (RLS) on table: ${tableName}`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`);
  }

  console.log('RLS successfully enabled on all tables.');
}

main()
  .catch((e) => {
    console.error('Error enabling RLS:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
