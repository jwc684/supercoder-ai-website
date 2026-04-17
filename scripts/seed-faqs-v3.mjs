// 랜딩 페이지 FAQ 시드 — v3 narrative 6 문항.
// 사용: npm run db:seed-faqs
//
// 동작:
//   - 기존 isPublished=true FAQ 를 모두 unpublish 한 뒤, v3 6 문항을 upsert.
//   - question 텍스트를 고유 키로 사용 (Faq 모델에 slug 필드 없음).
//   - answer 는 Tiptap JSON — 단일 paragraph 1~2 개.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Tiptap JSON 단일 문단 헬퍼 */
function paragraph(text) {
  return {
    type: "paragraph",
    content: [{ type: "text", text }],
  };
}

const ENTRIES = [
  {
    question: "채용팀이 직무를 잘 모를 때도 쓸 수 있나요?",
    paragraphs: [
      "네, 오히려 그때 가장 효과적입니다. AI가 JD를 분석해 직무 역량을 자동으로 추출하기 때문에, HR이 개발자나 디자이너 직무를 잘 몰라도 됩니다. AI가 기준을 잡아주고, 어떤 질문을 해야 하는지도 자동으로 설계합니다.",
    ],
  },
  {
    question: "현업 팀장들에게 면접관 교육을 따로 해야 하나요?",
    paragraphs: [
      "필요 없습니다. AI가 1차 면접 전체를 진행하기 때문에, 현업 팀장들은 AI 리포트를 받아보고 2차 면접 대상자를 결정하는 역할만 하면 됩니다. 면접 잘 보는 법을 따로 가르칠 필요가 없습니다.",
    ],
  },
  {
    question: "채용 결과를 경영진에게 어떻게 보고할 수 있나요?",
    paragraphs: [
      "모든 면접 결과가 역량별 점수, 답변 근거 인용, 영상 타임라인이 포함된 리포트로 자동 생성됩니다. 링크 하나로 경영진과 바로 공유할 수 있어, \"왜 이 사람을 2차로 올렸는가\"를 데이터로 설명할 수 있습니다.",
    ],
  },
  {
    question: "이력서 허위 기재를 실제로 걸러낼 수 있나요?",
    paragraphs: [
      "AI가 이력서 내용을 면접 중 실시간으로 교차 검증합니다. \"경험이 있다\"고 쓴 내용에 대해 구체적인 상황, 행동, 결과를 꼬리 질문으로 파고들기 때문에, 실제 경험이 없으면 자연스럽게 드러납니다. 부정행위 감지도 별도로 작동합니다.",
    ],
  },
  {
    question: "지원자가 AI 면접을 불편하게 느끼지 않을까요?",
    paragraphs: [
      "AI 면접관은 전문적이면서도 따뜻한 대화 톤으로 설계되어 있습니다. 로그인 없이 링크만으로 참여하고, 데스크탑·모바일 모두 지원하며 편한 시간에 진행할 수 있습니다. 실제 도입사에서 \"사람 면접보다 덜 긴장됐다\"는 지원자 피드백이 있었습니다.",
    ],
  },
  {
    question: "무료 체험은 어떻게 진행되나요?",
    paragraphs: [
      "도입 문의 후 1영업일 내 담당자가 연락드립니다. 30일 무료 체험 기간 동안 실제 채용 포지션에 적용해 보실 수 있으며, 온보딩 세션을 통해 처음 셋업을 함께 도와드립니다.",
    ],
  },
];

async function main() {
  console.log(`📝 랜딩 FAQ ${ENTRIES.length}개 시드 (v3)…`);

  // 1. 기존 공개 FAQ 전부 비공개화 (삭제는 하지 않음 — admin 에서 기존 데이터 참조 가능)
  const unpublished = await prisma.faq.updateMany({
    where: { isPublished: true },
    data: { isPublished: false },
  });
  console.log(`  · 기존 공개 FAQ ${unpublished.count}개 → 비공개 처리`);

  // 2. v3 문항 upsert (question 텍스트를 자연 키로 사용)
  for (let i = 0; i < ENTRIES.length; i++) {
    const entry = ENTRIES[i];
    const answer = {
      type: "doc",
      content: entry.paragraphs.map(paragraph),
    };

    const existing = await prisma.faq.findFirst({
      where: { question: entry.question },
    });

    if (existing) {
      await prisma.faq.update({
        where: { id: existing.id },
        data: {
          answer,
          order: i,
          isPublished: true,
        },
      });
      console.log(`  ✓ (update) ${entry.question}`);
    } else {
      await prisma.faq.create({
        data: {
          question: entry.question,
          answer,
          order: i,
          isPublished: true,
        },
      });
      console.log(`  ✓ (create) ${entry.question}`);
    }
  }

  console.log("\n🎉 완료 — 공개 FAQ 6 문항 준비됨");
}

main()
  .catch((err) => {
    console.error("❌ 실패:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
