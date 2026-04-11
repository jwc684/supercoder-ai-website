import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { FaqListClient } from "./FaqListClient";

/**
 * /admin/faqs — FAQ 목록 + 순서 조정 + 공개 토글.
 */
export default async function AdminFaqsListPage() {
  await requireAdmin();

  const faqs = await prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      question: true,
      order: true,
      isPublished: true,
      updatedAt: true,
    },
  });

  const initialFaqs = faqs.map((f) => ({
    ...f,
    updatedAt: f.updatedAt.toISOString(),
  }));

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            FAQ
          </p>
          <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
            FAQ 관리
          </h1>
          <p className="mt-1 text-[14px] text-[#5f6363]">
            랜딩 페이지 하단 FAQ 섹션에 노출될 질문/답변을 관리합니다. 위/아래
            화살표로 순서를 조정하고, &quot;공개&quot; 토글로 노출을
            제어합니다.
          </p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="h-4 w-4" />새 FAQ 작성
        </Link>
      </div>

      <FaqListClient initialFaqs={initialFaqs} />
    </div>
  );
}
