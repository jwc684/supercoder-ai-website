import { prisma } from "@/lib/prisma";
import { renderTiptap } from "@/lib/tiptap";
import { FaqAccordionItem } from "./FaqAccordionItem";

/**
 * Faqs — 랜딩 페이지 FAQ 섹션.
 * Maki .c_faq 매칭 (12-col 안 3 row 구조):
 *   - 왼쪽 (col 1–5): g_label eyebrow + g_title--l H2
 *   - 오른쪽 (col 7–12, 약 절반 너비): FAQ 아코디언 리스트 (Schema.org microdata)
 * 중간 1-col gutter 로 숨쉬는 공간 확보. 모바일/태블릿에서는 stacked.
 *
 * Prisma `faq` 테이블에서 isPublished=true 항목만 order asc 로 조회.
 * 공개 FAQ 가 없으면 섹션 자체를 렌더하지 않음.
 */
export async function Faqs() {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, question: true, answer: true },
  });

  if (faqs.length === 0) return null;

  // 서버에서 미리 answer(Tiptap JSON) → HTML 렌더.
  const items = faqs.map((f) => {
    const { html } = renderTiptap(f.answer as object);
    return { id: f.id, question: f.question, answerHtml: html };
  });

  return (
    <div
      itemScope
      itemType="https://schema.org/FAQPage"
      className="py-20 md:py-28 lg:py-32"
    >
      <div className="wp-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left (col 1–5) — label + H2 */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[120px]">
              <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
                FAQ
              </span>
              <h2 className="mt-4 text-[2.25rem] font-medium leading-[1.1] tracking-normal text-[#282828] md:text-[3rem] lg:text-[3.5rem]">
                자주 묻는 질문
              </h2>
              <p className="mt-5 text-[16px] leading-[1.55] text-[#5f6363] md:text-[18px] md:leading-[1.55]">
                슈퍼코더 AI Interviewer 에 대해 가장 많이 받는 질문들을
                모았습니다. 더 궁금한 점이 있다면 언제든 문의해 주세요.
              </p>
            </div>
          </div>

          {/* Right (col 7–12, ~절반 너비) — accordion list */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border-t border-[var(--color-border)]">
              {items.map((it) => (
                <FaqAccordionItem
                  key={it.id}
                  question={it.question}
                  answerHtml={it.answerHtml}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
