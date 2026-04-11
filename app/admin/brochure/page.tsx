import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { BrochureClient } from "./BrochureClient";

/**
 * /admin/brochure — 서비스 소개서 PDF 업로드/관리.
 *
 * 최신 업로드 (createdAt desc) 가 공개 /download 페이지에서 사용되는
 * "현재 활성" 브로셔. 관리자는 새 파일을 업로드하거나 이전 버전을 삭제할
 * 수 있다.
 */
export default async function AdminBrochurePage() {
  await requireAdmin();

  const rows = await prisma.brochure.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      url: true,
      size: true,
      mime: true,
      createdAt: true,
    },
  });

  const initialBrochures = rows.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Brochure
        </p>
        <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
          서비스 소개서 관리
        </h1>
        <p className="mt-1 text-[14px] text-[#5f6363]">
          공개 /download 페이지에서 제공되는 서비스 소개서 PDF 를 업로드합니다.
          가장 최근 업로드된 파일이 자동으로 활성화됩니다.
        </p>
      </div>

      <BrochureClient initialBrochures={initialBrochures} />
    </div>
  );
}
