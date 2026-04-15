/**
 * Hanya seed layanan, portfolio, tentang, dan karier (tanpa post blog).
 * Pakai: npm run db:seed:marketing
 */
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { seedMarketingContent } from './seed-marketing-content';

config();
config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

async function main() {
  await seedMarketingContent(prisma);
  console.log('Seed marketing: tentang, layanan, portfolio, dan karier disinkronkan ke database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
