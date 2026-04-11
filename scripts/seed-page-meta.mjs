// 정적 페이지 SEO 메타 시드.
// 사용: npx dotenv -e .env.local -- node scripts/seed-page-meta.mjs
//
// 9 개 정적 경로의 초기 PageMeta 레코드 upsert.
// 이후 관리자 /admin/seo 에서 개별 편집 가능.
// lib/seo.ts 의 STATIC_FALLBACKS 와 동일한 값 유지.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ENTRIES = [
  {
    path: "/",
    title: "슈퍼코더 AI Interviewer — 코비(Kobi)",
    description:
      "코비가 채용의 모든 과정을 자동화합니다. 채용공고 분석부터 실시간 AI 면접, 리포트까지 한 번에.",
  },
  {
    path: "/blog",
    title: "블로그",
    description:
      "AI 채용 · HR 인사이트 · 고객 사례 · 제품 업데이트 등 슈퍼코더의 최신 글을 읽어보세요.",
  },
  {
    path: "/contact",
    title: "도입 문의",
    description:
      "슈퍼코더 팀과 함께 귀사의 채용 프로세스에 맞춘 맞춤 데모를 진행합니다. 1 영업일 내 연락드립니다.",
  },
  {
    path: "/download",
    title: "서비스 소개서",
    description:
      "슈퍼코더 AI Interviewer 의 기능, 도입 사례, 가격 정책까지 한 PDF 에 담았습니다.",
  },
  {
    path: "/trial",
    title: "무료 체험",
    description:
      "슈퍼코더 AI Interviewer 의 AI 면접을 직접 체험해보세요. 현재는 1:1 맞춤 데모로 안내드립니다.",
  },
  {
    path: "/privacy",
    title: "개인정보처리방침",
    description: "슈퍼코더의 개인정보 수집·이용·보관 정책.",
  },
  {
    path: "/terms-enterprise",
    title: "기업용 이용약관",
    description: "슈퍼코더 AI Interviewer 를 도입한 기업 고객 대상 이용약관.",
  },
  {
    path: "/terms-candidate",
    title: "지원자용 이용약관",
    description:
      "AI 면접에 응시하는 지원자를 위한 이용약관 및 개인정보 처리 안내.",
  },
  {
    path: "/404",
    title: "페이지를 찾을 수 없습니다",
    description: "요청하신 페이지가 이동되었거나 더 이상 존재하지 않을 수 있습니다.",
  },
];

async function main() {
  console.log(`📝 PageMeta ${ENTRIES.length}개 upsert…`);
  for (const e of ENTRIES) {
    await prisma.pageMeta.upsert({
      where: { path: e.path },
      update: { title: e.title, description: e.description },
      create: {
        path: e.path,
        title: e.title,
        description: e.description,
        indexable: true,
      },
    });
    console.log(`  ✓ ${e.path}`);
  }
  console.log("\n🎉 완료");
}

main()
  .catch((err) => {
    console.error("❌ 실패:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
