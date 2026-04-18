import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { DownloadsTable } from "./DownloadsTable";

/**
 * /admin/downloads — 소개서 다운로드 리드 리스트 (기획문서 4.6).
 */
export default async function AdminDownloadsPage() {
  await requireAdmin();

  const downloads = await prisma.download.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const initialData = downloads.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
    emailSentAt: d.emailSentAt?.toISOString() ?? null,
    emailFirstOpenedAt: d.emailFirstOpenedAt?.toISOString() ?? null,
    emailFirstClickedAt: d.emailFirstClickedAt?.toISOString() ?? null,
  }));

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Downloads
        </p>
        <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
          소개서 다운로드
        </h1>
        <p className="mt-1 text-[14px] text-[#5f6363]">
          최근 {initialData.length}건 표시. CSV 로 내보낼 수 있습니다.
        </p>
      </div>

      <div className="mt-8">
        <DownloadsTable initialData={initialData} />
      </div>
    </div>
  );
}
