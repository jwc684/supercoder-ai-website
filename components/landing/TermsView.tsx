import type { TermsType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { renderTiptap } from "@/lib/tiptap";
import { TERMS_TYPE_LABELS } from "@/lib/validations";

/**
 * TermsView — 공개 약관 페이지 공통 레이아웃.
 * type 을 받아 활성(isActive=true) 약관 1건을 Prisma 에서 직접 조회 후
 * Tiptap JSON → HTML 렌더.
 *
 * /privacy, /terms-enterprise, /terms-candidate 에서 type 만 바꿔 재사용.
 */
export async function TermsView({ type }: { type: TermsType }) {
  const terms = await prisma.terms.findFirst({
    where: { type, isActive: true },
    orderBy: { effectiveDate: "desc" },
  });

  // 활성 약관이 없으면 placeholder 안내
  if (!terms) {
    return (
      <div className="bg-white">
        <div className="wp-container py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              Legal
            </p>
            <h1 className="mt-4 text-[2.25rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[3.5rem]">
              {TERMS_TYPE_LABELS[type]}
            </h1>
            <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-border)] bg-[#fafbfc] px-6 py-16 text-center">
              <p className="text-[15px] leading-[1.6] text-[#5f6363]">
                아직 공개된 약관이 없습니다.
                <br />
                관리자 페이지에서 약관을 작성 후 활성화해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { html } = renderTiptap(terms.content as object);

  return (
    <div className="bg-white">
      <div className="wp-container py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Eyebrow */}
          <p className="text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            Legal · {TERMS_TYPE_LABELS[type]}
          </p>

          {/* H1 — title-l */}
          <h1 className="mt-4 text-[2.25rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[3.5rem]">
            {terms.title}
          </h1>

          {/* Meta: 버전 + 시행일 */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[var(--color-border)] pb-6 text-[14px] text-[#5f6363]">
            <span className="inline-flex items-center gap-1.5">
              <span className="font-medium text-[#282828]">버전</span>
              <span>v{terms.version}</span>
            </span>
            <span className="h-3 w-px bg-[var(--color-border)]" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <span className="font-medium text-[#282828]">시행일</span>
              <span>{formatDateLong(terms.effectiveDate)}</span>
            </span>
          </div>

          {/* 본문 */}
          <article
            className="prose-blog mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}

function formatDateLong(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
