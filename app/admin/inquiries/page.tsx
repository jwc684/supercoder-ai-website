import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { InquiriesTable } from "./InquiriesTable";

/**
 * /admin/inquiries — 도입 문의 리스트 (기획문서 4.5).
 *
 * 서버 컴포넌트에서 초기 데이터 로드 (최근 200건) + 클라이언트 테이블로 인터랙션.
 */
export default async function AdminInquiriesPage() {
  await requireAdmin();

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Date → string 직렬화 (클라이언트 컴포넌트 prop 으로 전달)
  const initialData = inquiries.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Inquiries
        </p>
        <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
          도입 문의
        </h1>
        <p className="mt-1 text-[14px] text-[#5f6363]">
          최근 {initialData.length}건 표시. 상태 변경/메모는 즉시 저장됩니다.
        </p>
      </div>

      <div className="mt-8">
        <InquiriesTable initialData={initialData} />
      </div>
    </div>
  );
}
