import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { LogosClient } from "./LogosClient";

/**
 * /admin/logos — 레퍼런스 고객 로고 관리 (업로드, 이름 편집, 순서, 공개 토글, 삭제).
 */
export default async function AdminLogosPage() {
  await requireAdmin();

  const logos = await prisma.logo.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const initialData = logos.map((l) => ({
    id: l.id,
    name: l.name,
    url: l.url,
    sortOrder: l.sortOrder,
    isVisible: l.isVisible,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Logos
        </p>
        <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
          레퍼런스 로고
        </h1>
        <p className="mt-1 text-[14px] text-[#5f6363]">
          랜딩 페이지 히어로 아래 마키(marquee) 영역에 노출되는 고객사 로고를
          관리합니다. 순서는 위 ↑↓ 버튼으로 변경하세요.
        </p>
      </div>

      <div className="mt-8">
        <LogosClient initialData={initialData} />
      </div>
    </div>
  );
}
