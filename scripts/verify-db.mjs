// Verifies Phase 0 DB connectivity and table creation.
// Run: npx dotenv -e .env.local -- node scripts/verify-db.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;

  console.log("📦 Supabase 'public' schema tables:");
  for (const row of tables) {
    console.log("  •", row.table_name);
  }

  const counts = {
    admin_users: await prisma.adminUser.count(),
    blog_posts: await prisma.blogPost.count(),
    terms: await prisma.terms.count(),
    inquiries: await prisma.inquiry.count(),
    downloads: await prisma.download.count(),
  };

  console.log("\n📊 Row counts:");
  for (const [name, count] of Object.entries(counts)) {
    console.log(`  ${name.padEnd(15)} ${count}`);
  }
}

main()
  .catch((err) => {
    console.error("❌", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
