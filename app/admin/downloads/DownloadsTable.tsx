"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Search } from "lucide-react";
import { downloadCsv, toCsv, type CsvColumn } from "@/lib/csv";

type DownloadRow = {
  id: string;
  company: string;
  name: string;
  email: string;
  jobTitle: string | null;
  phone: string | null;
  interests: string[];
  createdAt: string;
  emailSentAt: string | null;
  emailSendError: string | null;
  emailOpenCount: number;
  emailFirstOpenedAt: string | null;
  emailClickCount: number;
  emailFirstClickedAt: string | null;
};

export function DownloadsTable({
  initialData,
}: {
  initialData: DownloadRow[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return initialData;
    const q = query.trim().toLowerCase();
    return initialData.filter((r) =>
      `${r.company} ${r.name} ${r.email}`.toLowerCase().includes(q),
    );
  }, [initialData, query]);

  const handleExport = () => {
    const columns: CsvColumn<DownloadRow>[] = [
      { header: "ID", accessor: (r) => r.id },
      { header: "다운로드일", accessor: (r) => new Date(r.createdAt) },
      { header: "회사명", accessor: (r) => r.company },
      { header: "담당자", accessor: (r) => r.name },
      { header: "이메일", accessor: (r) => r.email },
      { header: "직책", accessor: (r) => r.jobTitle },
      { header: "전화번호", accessor: (r) => r.phone },
      { header: "관심분야", accessor: (r) => r.interests },
      {
        header: "이메일 발송",
        accessor: (r) =>
          r.emailSentAt
            ? new Date(r.emailSentAt)
            : r.emailSendError
              ? `실패: ${r.emailSendError}`
              : "미발송",
      },
      { header: "열람 횟수", accessor: (r) => r.emailOpenCount },
      {
        header: "최초 열람",
        accessor: (r) =>
          r.emailFirstOpenedAt ? new Date(r.emailFirstOpenedAt) : null,
      },
      { header: "다운로드 클릭", accessor: (r) => r.emailClickCount },
      {
        header: "최초 클릭",
        accessor: (r) =>
          r.emailFirstClickedAt ? new Date(r.emailFirstClickedAt) : null,
      },
    ];
    const csv = toCsv(filtered, columns);
    const today = new Date().toISOString().split("T")[0];
    downloadCsv(`downloads-${today}.csv`, csv);
    toast.success(`${filtered.length}건 CSV 내보내기 완료`);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <div className="flex items-center gap-2 text-[13px] text-[#5f6363]">
          <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-[12px] font-medium text-[#5f6363]">
            전체 {filtered.length} 건
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="회사/담당자/이메일 검색"
              className="h-10 w-full min-w-[220px] rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-3 text-[13px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            <Download className="h-4 w-4" />
            CSV 내보내기
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-[#fafbfc]">
            <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
              <th className="px-4 py-3">회사</th>
              <th className="px-4 py-3">담당자</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">직책</th>
              <th className="px-4 py-3">관심분야</th>
              <th className="px-4 py-3">이메일 상태</th>
              <th className="px-4 py-3 text-center">열람</th>
              <th className="px-4 py-3 text-center">클릭</th>
              <th className="px-4 py-3">신청일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-[13px] text-[#5f6363]"
                >
                  조건에 맞는 다운로드가 없습니다.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--color-border)] last:border-0 transition-colors hover:bg-[#f8f9fa]"
              >
                <td className="px-4 py-3 text-[13px] font-medium text-[#282828]">
                  {row.company}
                </td>
                <td className="px-4 py-3 text-[13px] text-[#282828]">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-[#5f6363]">
                  {row.email}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-[#5f6363]">
                  {row.jobTitle ?? "-"}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5f6363]">
                  {row.interests.length ? (
                    <div className="flex flex-wrap gap-1">
                      {row.interests.map((it) => (
                        <span
                          key={it}
                          className="inline-flex items-center rounded-md bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)]"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  <EmailStatusBadge row={row} />
                </td>
                <td className="px-4 py-3 text-center">
                  <CountCell
                    count={row.emailOpenCount}
                    tooltip={
                      row.emailFirstOpenedAt
                        ? `최초 ${formatDate(row.emailFirstOpenedAt)}`
                        : undefined
                    }
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <CountCell
                    count={row.emailClickCount}
                    tooltip={
                      row.emailFirstClickedAt
                        ? `최초 ${formatDate(row.emailFirstClickedAt)}`
                        : undefined
                    }
                  />
                </td>
                <td className="px-4 py-3 text-[12.5px] text-[#5f6363]">
                  {formatDate(row.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 이메일 발송 상태 배지 — 3 상태: 발송(녹색) / 실패(빨강, 툴팁) / 미발송(회색). */
function EmailStatusBadge({ row }: { row: DownloadRow }) {
  if (row.emailSentAt) {
    return (
      <span
        className="inline-flex items-center rounded-md bg-[#e6f6ee] px-2 py-0.5 text-[11px] font-semibold text-[#047857]"
        title={`발송 ${formatDate(row.emailSentAt)}`}
      >
        발송
      </span>
    );
  }
  if (row.emailSendError) {
    return (
      <span
        className="inline-flex items-center rounded-md bg-[#fdeaea] px-2 py-0.5 text-[11px] font-semibold text-[#b91c1c]"
        title={row.emailSendError}
      >
        실패
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-[var(--color-bg-alt)] px-2 py-0.5 text-[11px] font-semibold text-[#6b7280]">
      미발송
    </span>
  );
}

/** 숫자 셀 — 0 이면 dim, >0 이면 강조 + 최초 시간 툴팁. */
function CountCell({
  count,
  tooltip,
}: {
  count: number;
  tooltip?: string;
}) {
  if (count <= 0) {
    return <span className="text-[12.5px] text-[#9099a3]">-</span>;
  }
  return (
    <span
      className="inline-flex items-center rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-[12px] font-semibold text-[var(--color-primary)]"
      title={tooltip}
    >
      {count}회
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${h}:${min}`;
  } catch {
    return iso;
  }
}
