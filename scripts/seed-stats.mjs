// 통계 카운터 시드/재동기화 스크립트.
// 사용: npx dotenv -e .env.local -- node scripts/seed-stats.mjs
//
// 동작:
//   1. 현재 DB 의 실제값을 COUNT 쿼리로 계산
//   2. Stats("singleton") row 를 upsert 로 덮어씀
//   3. 각 BlogPost 의 viewCount 를 page_views 에서 계산해 백필
//
// 언제 실행?
//   - 마이그레이션 직후 (초기 시드)
//   - 드리프트 의심 시 (카운터가 실제와 맞지 않을 때)
//   - 프로덕션 / 프리뷰 / 로컬 각 환경별 1 회씩

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📊 현재 실제값 계산 중…");

  // 싱글톤용 총합 6종
  const [inq, inqNew, dl, blog, blogPub, pv] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.download.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.pageView.count(),
  ]);

  console.log(`  - inquiries.total    = ${inq}`);
  console.log(`  - inquiries.new      = ${inqNew}`);
  console.log(`  - downloads.total    = ${dl}`);
  console.log(`  - blogPosts.total    = ${blog}`);
  console.log(`  - blogPosts.pub      = ${blogPub}`);
  console.log(`  - pageViews.total    = ${pv}`);

  console.log("\n💾 Stats singleton upsert…");
  await prisma.stats.upsert({
    where: { id: "singleton" },
    update: {
      inquiriesTotal: inq,
      inquiriesNew: inqNew,
      downloadsTotal: dl,
      blogPostsTotal: blog,
      blogPostsPublished: blogPub,
      pageViewsTotal: pv,
    },
    create: {
      id: "singleton",
      inquiriesTotal: inq,
      inquiriesNew: inqNew,
      downloadsTotal: dl,
      blogPostsTotal: blog,
      blogPostsPublished: blogPub,
      pageViewsTotal: pv,
    },
  });
  console.log("✅ Stats singleton 동기화 완료");

  // BlogPost.viewCount 백필 — /blog/{slug} 방문 집계
  console.log("\n📈 블로그 viewCount 백필 중…");
  const blogPaths = await prisma.pageView.groupBy({
    by: ["path"],
    where: { path: { startsWith: "/blog/" } },
    _count: { _all: true },
  });
  console.log(`  - 발견된 /blog/* 경로: ${blogPaths.length}`);

  let updated = 0;
  for (const row of blogPaths) {
    const slug = row.path.replace(/^\/blog\//, "").replace(/\/$/, "");
    if (!slug) continue;
    const res = await prisma.blogPost.updateMany({
      where: { slug },
      data: { viewCount: row._count._all },
    });
    if (res.count > 0) updated += res.count;
  }
  console.log(`✅ ${updated}건의 BlogPost.viewCount 백필 완료`);

  console.log("\n🎉 시드 완료");
}

main()
  .catch((err) => {
    console.error("❌ 실패:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
