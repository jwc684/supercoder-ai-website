import Link from "next/link";
import { Plus, Edit, CheckCircle2, Circle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { TERMS_TYPE_LABELS } from "@/lib/validations";

/**
 * /admin/terms — 약관 목록 (기획문서 4.4).
 *
 * 테이블: 약관명 | 유형 | 버전 | 상태(활성/비활성) | 시행일 | 액션
 * "새 약관 작성" 버튼 → /admin/terms/new
 */
export default async function AdminTermsListPage() {
  await requireAdmin();

  const terms = await prisma.terms.findMany({
    orderBy: [{ type: "asc" }, { effectiveDate: "desc" }],
    take: 200,
  });

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Terms
          </p>
          <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
            약관 관리
          </h1>
          <p className="mt-1 text-[14px] text-[#5f6363]">
            개인정보처리방침 · 기업용 이용약관 · 지원자용 이용약관 · 마케팅
            수신 동의 관리. 동일 유형에서 활성화된 약관은 1개만 존재합니다.
          </p>
        </div>
        <Link
          href="/admin/terms/new"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="h-4 w-4" />새 약관 작성
        </Link>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-[#fafbfc]">
            <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
              <th className="px-4 py-3">약관명</th>
              <th className="px-4 py-3">유형</th>
              <th className="px-4 py-3">버전</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">시행일</th>
              <th className="px-4 py-3 text-right">액션</th>
            </tr>
          </thead>
          <tbody>
            {terms.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[13px] text-[#5f6363]"
                >
                  약관이 없습니다. 상단 &quot;새 약관 작성&quot; 버튼으로 시작하세요.
                </td>
              </tr>
            )}
            {terms.map((t) => (
              <tr
                key={t.id}
                className="border-b border-[var(--color-border)] last:border-0 transition-colors hover:bg-[#f8f9fa]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/terms/${t.id}`}
                    className="text-[13px] font-medium text-[#282828] hover:text-[var(--color-primary)]"
                  >
                    {t.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5f6363]">
                  {TERMS_TYPE_LABELS[t.type]}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5f6363]">
                  v{t.version}
                </td>
                <td className="px-4 py-3">
                  {t.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-semibold text-[#16a34a] ring-1 ring-inset ring-[#bbf7d0]">
                      <CheckCircle2 className="h-3 w-3" />
                      활성
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f9fa] px-2.5 py-1 text-[11px] font-semibold text-[#5f6363] ring-1 ring-inset ring-[var(--color-border)]">
                      <Circle className="h-3 w-3" />
                      비활성
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5f6363]">
                  {formatDate(t.effectiveDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/terms/${t.id}`}
                      title="편집"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] hover:bg-[#f0f1f3] hover:text-[var(--color-primary)]"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
