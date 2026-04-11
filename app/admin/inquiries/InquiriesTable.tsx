"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Download, Search, X, Loader2 } from "lucide-react";
import { downloadCsv, toCsv, type CsvColumn } from "@/lib/csv";

/**
 * Admin 도입 문의 테이블 (클라이언트).
 * - 필터: 상태 드롭다운 + 검색 (company/name/email)
 * - 행 클릭 → 상세 모달 (메시지 전문 + adminNote 편집)
 * - 상태 드롭다운 즉시 PATCH
 * - CSV 내보내기
 */

type InquiryRow = {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string | null;
  hireSize: string | null;
  interests: string[];
  message: string | null;
  privacyAgreed: boolean;
  status: "NEW" | "REVIEWED" | "CONTACTED" | "COMPLETED";
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABELS: Record<InquiryRow["status"], string> = {
  NEW: "신규",
  REVIEWED: "확인",
  CONTACTED: "연락 중",
  COMPLETED: "완료",
};

const STATUS_STYLES: Record<InquiryRow["status"], string> = {
  NEW: "bg-[#fef2f2] text-[#dc2626] ring-[#fecaca]",
  REVIEWED: "bg-[#fffbeb] text-[#b45309] ring-[#fde68a]",
  CONTACTED: "bg-[#eff6ff] text-[#2563eb] ring-[#bfdbfe]",
  COMPLETED: "bg-[#f0fdf4] text-[#16a34a] ring-[#bbf7d0]",
};

export function InquiriesTable({
  initialData,
}: {
  initialData: InquiryRow[];
}) {
  const [rows, setRows] = useState<InquiryRow[]>(initialData);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | InquiryRow["status"]
  >("ALL");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<InquiryRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = `${r.company} ${r.name} ${r.email}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [rows, statusFilter, query]);

  const statusCounts = useMemo(() => {
    const counts: Record<"ALL" | InquiryRow["status"], number> = {
      ALL: rows.length,
      NEW: 0,
      REVIEWED: 0,
      CONTACTED: 0,
      COMPLETED: 0,
    };
    rows.forEach((r) => counts[r.status]++);
    return counts;
  }, [rows]);

  const updateRow = async (
    id: string,
    data: Partial<Pick<InquiryRow, "status" | "adminNote">>,
  ) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "업데이트 실패");

      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r)),
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, ...data } : prev));
      }
      toast.success("업데이트되었습니다.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`업데이트 실패: ${msg}`);
    }
  };

  const handleExport = () => {
    const columns: CsvColumn<InquiryRow>[] = [
      { header: "ID", accessor: (r) => r.id },
      { header: "생성일", accessor: (r) => new Date(r.createdAt) },
      { header: "상태", accessor: (r) => STATUS_LABELS[r.status] },
      { header: "회사명", accessor: (r) => r.company },
      { header: "담당자", accessor: (r) => r.name },
      { header: "이메일", accessor: (r) => r.email },
      { header: "전화번호", accessor: (r) => r.phone },
      { header: "직책", accessor: (r) => r.jobTitle },
      { header: "채용규모", accessor: (r) => r.hireSize },
      { header: "관심서비스", accessor: (r) => r.interests },
      { header: "메시지", accessor: (r) => r.message },
      { header: "관리자 메모", accessor: (r) => r.adminNote },
    ];
    const csv = toCsv(filtered, columns);
    const today = new Date().toISOString().split("T")[0];
    downloadCsv(`inquiries-${today}.csv`, csv);
    toast.success(`${filtered.length}건 CSV 내보내기 완료`);
  };

  return (
    <div>
      {/* Toolbar: 필터 + 검색 + CSV */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-4 md:flex-row md:items-center md:justify-between md:p-5">
        {/* 상태 필터 칩 */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            ["ALL", "NEW", "REVIEWED", "CONTACTED", "COMPLETED"] as const
          ).map((s) => {
            const active = statusFilter === s;
            const label = s === "ALL" ? "전체" : STATUS_LABELS[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-white text-[#5f6363] hover:border-[var(--color-primary)]/40"
                }`}
              >
                {label}
                <span className="text-[11px] text-[#5f6363]">
                  {statusCounts[s]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* 검색 */}
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

          {/* CSV 내보내기 */}
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

      {/* 테이블 */}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full min-w-[960px] text-left">
          <thead className="bg-[#fafbfc]">
            <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
              <th className="px-4 py-3">회사</th>
              <th className="px-4 py-3">담당자</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">전화</th>
              <th className="px-4 py-3">규모</th>
              <th className="px-4 py-3">문의일</th>
              <th className="px-4 py-3">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-[13px] text-[#5f6363]"
                >
                  조건에 맞는 문의가 없습니다.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelected(row)}
                className="cursor-pointer border-b border-[var(--color-border)] last:border-0 transition-colors hover:bg-[#f8f9fa]"
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
                  {row.phone}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-[#5f6363]">
                  {row.hireSize ?? "-"}
                </td>
                <td className="px-4 py-3 text-[12.5px] text-[#5f6363]">
                  {formatDate(row.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <StatusDropdown
                    value={row.status}
                    onChange={(status) => {
                      startTransition(() => {
                        updateRow(row.id, { status });
                      });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {selected && (
        <DetailModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onUpdate={(data) => updateRow(selected.id, data)}
          isPending={isPending}
        />
      )}
    </div>
  );
}

// ─── Status Dropdown ────────────────────────────────────────────
function StatusDropdown({
  value,
  onChange,
}: {
  value: InquiryRow["status"];
  onChange: (s: InquiryRow["status"]) => void;
}) {
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        e.stopPropagation();
        onChange(e.target.value as InquiryRow["status"]);
      }}
      className={`appearance-none rounded-full border px-3 py-1 text-[11px] font-semibold ring-1 ring-inset ${STATUS_STYLES[value]} focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30`}
    >
      {(["NEW", "REVIEWED", "CONTACTED", "COMPLETED"] as const).map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

// ─── Detail Modal ───────────────────────────────────────────────
function DetailModal({
  inquiry,
  onClose,
  onUpdate,
  isPending,
}: {
  inquiry: InquiryRow;
  onClose: () => void;
  onUpdate: (data: Partial<Pick<InquiryRow, "adminNote">>) => void;
  isPending: boolean;
}) {
  const [note, setNote] = useState(inquiry.adminNote ?? "");

  const handleSaveNote = async () => {
    await onUpdate({ adminNote: note.trim() || null });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#5f6363] hover:bg-[#f8f9fa] hover:text-[#282828]"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Inquiry · {formatDate(inquiry.createdAt)}
        </p>
        <h2 className="mt-1 text-[22px] font-semibold text-[#282828]">
          {inquiry.company}
        </h2>

        {/* 기본 정보 그리드 */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-[13px]">
          <Info label="담당자" value={inquiry.name} />
          <Info label="이메일" value={inquiry.email} />
          <Info label="전화번호" value={inquiry.phone} />
          <Info label="직책" value={inquiry.jobTitle ?? "-"} />
          <Info label="채용 규모" value={inquiry.hireSize ?? "-"} />
          <Info
            label="관심 서비스"
            value={inquiry.interests.length ? inquiry.interests.join(", ") : "-"}
          />
        </div>

        {/* 메시지 */}
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            문의 내용
          </p>
          <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-[#fafbfc] p-4 text-[13px] leading-[1.6] text-[#282828]">
            {inquiry.message || (
              <span className="text-[#9ca3af]">(메시지 없음)</span>
            )}
          </div>
        </div>

        {/* 관리자 메모 */}
        <div className="mt-6">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            관리자 메모
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="내부 메모를 자유롭게 남겨주세요 (고객에게 노출되지 않음)"
            className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-[13px] leading-[1.6] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-lg border border-[var(--color-border)] bg-white px-4 text-[13px] font-semibold text-[#5f6363] hover:text-[#282828]"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleSaveNote}
              disabled={isPending}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              메모 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5f6363]">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] text-[#282828]">{value}</p>
    </div>
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
