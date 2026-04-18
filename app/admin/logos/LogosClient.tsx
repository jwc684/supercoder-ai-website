"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type LogoRow = {
  id: string;
  name: string;
  url: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
};

export function LogosClient({ initialData }: { initialData: LogoRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<LogoRow[]>(initialData);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadName, setUploadName] = useState("");

  const refresh = () => startTransition(() => router.refresh());

  // ─ 업로드 ─
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("파일을 선택해주세요");
      return;
    }
    if (!uploadName.trim()) {
      toast.error("업체명을 입력해주세요");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("name", uploadName.trim());

    setUploading(true);
    try {
      const res = await fetch("/api/admin/logos", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "업로드 실패");
      toast.success(`"${json.logo.name}" 추가됨`);
      setRows((prev) => [...prev, {
        id: json.logo.id,
        name: json.logo.name,
        url: json.logo.url,
        sortOrder: json.logo.sortOrder,
        isVisible: json.logo.isVisible,
        createdAt: json.logo.createdAt,
      }]);
      setUploadName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`업로드 실패: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  // ─ 이름 수정 ─
  const handleRename = async (id: string, nextName: string) => {
    const trimmed = nextName.trim();
    if (!trimmed) {
      toast.error("업체명을 입력해주세요");
      return;
    }
    const prev = rows.find((r) => r.id === id);
    if (!prev || prev.name === trimmed) return;

    setRows((prevRows) =>
      prevRows.map((r) => (r.id === id ? { ...r, name: trimmed } : r)),
    );
    try {
      const res = await fetch(`/api/admin/logos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error("저장 실패");
      toast.success("저장되었습니다");
    } catch (err) {
      // rollback
      setRows((prevRows) =>
        prevRows.map((r) => (r.id === id ? { ...r, name: prev.name } : r)),
      );
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(msg);
    }
  };

  // ─ 가시성 토글 ─
  const toggleVisibility = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const next = !row.isVisible;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVisible: next } : r)),
    );
    try {
      const res = await fetch(`/api/admin/logos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: next }),
      });
      if (!res.ok) throw new Error("변경 실패");
      refresh();
    } catch {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isVisible: row.isVisible } : r,
        ),
      );
      toast.error("변경 실패");
    }
  };

  // ─ 순서 변경 ─
  const move = async (id: string, direction: -1 | 1) => {
    const idx = rows.findIndex((r) => r.id === id);
    const target = idx + direction;
    if (idx === -1 || target < 0 || target >= rows.length) return;

    const next = [...rows];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    // sortOrder 재계산 (1-based)
    const renumbered = next.map((r, i) => ({ ...r, sortOrder: i + 1 }));
    setRows(renumbered);

    try {
      const res = await fetch("/api/admin/logos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: renumbered.map((r) => r.id) }),
      });
      if (!res.ok) throw new Error("재정렬 실패");
      refresh();
    } catch {
      setRows(rows); // rollback
      toast.error("재정렬 실패");
    }
  };

  // ─ 삭제 ─
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" 로고를 삭제하시겠습니까? (되돌릴 수 없음)`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/logos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("삭제되었습니다");
      refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 업로드 카드 */}
      <form
        onSubmit={handleUpload}
        className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label className="block text-[12px] font-medium text-[#5f6363]">
            업체명 *
          </label>
          <input
            type="text"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            placeholder="예: GlobalTech"
            className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-[13px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[12px] font-medium text-[#5f6363]">
            로고 파일 * <span className="text-[11px] text-[#9099a3]">PNG / JPEG / WebP / SVG · 최대 2MB</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="mt-1.5 h-10 w-full text-[12px] file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-[var(--color-primary-light)] file:px-3 file:text-[12px] file:font-medium file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary-light)]/70"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "업로드 중…" : "로고 추가"}
        </button>
      </form>

      {/* 리스트 */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full">
          <thead className="bg-[#fafbfc]">
            <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
              <th className="w-[60px] px-4 py-3 text-center">#</th>
              <th className="w-[140px] px-4 py-3">로고</th>
              <th className="px-4 py-3">업체명</th>
              <th className="w-[110px] px-4 py-3 text-center">공개</th>
              <th className="w-[120px] px-4 py-3 text-center">순서</th>
              <th className="w-[70px] px-4 py-3 text-right pr-5">삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[13px] text-[#5f6363]"
                >
                  등록된 로고가 없습니다. 위에서 추가해주세요.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <LogoRowView
                key={row.id}
                row={row}
                isFirst={i === 0}
                isLast={i === rows.length - 1}
                onRename={handleRename}
                onToggleVisibility={toggleVisibility}
                onMoveUp={() => move(row.id, -1)}
                onMoveDown={() => move(row.id, 1)}
                onDelete={() => handleDelete(row.id, row.name)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {isPending && (
        <p className="text-[12px] text-[#9099a3]">변경사항 동기화 중…</p>
      )}
    </div>
  );
}

function LogoRowView({
  row,
  isFirst,
  isLast,
  onRename,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  row: LogoRow;
  isFirst: boolean;
  isLast: boolean;
  onRename: (id: string, name: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(row.name);

  const saveRename = () => {
    onRename(row.id, draft);
    setEditing(false);
  };

  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[#f8f9fa]">
      <td className="px-4 py-3 text-center text-[12px] text-[#9099a3]">
        {row.sortOrder}
      </td>
      <td className="px-4 py-3">
        <div className="flex h-10 w-[120px] items-center justify-center rounded-md border border-[var(--color-border)] bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.url}
            alt={row.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRename();
                if (e.key === "Escape") {
                  setDraft(row.name);
                  setEditing(false);
                }
              }}
              autoFocus
              className="h-8 flex-1 rounded-md border border-[var(--color-border)] bg-white px-2 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
            <button
              type="button"
              onClick={saveRename}
              aria-label="저장"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary)] text-white"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(row.name);
                setEditing(false);
              }}
              aria-label="취소"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border)] text-[#5f6363]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#282828] hover:text-[var(--color-primary)]"
          >
            {row.name}
            <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => onToggleVisibility(row.id)}
          aria-label={row.isVisible ? "공개 중 — 클릭해 비공개" : "비공개 — 클릭해 공개"}
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
            row.isVisible
              ? "bg-[#e6f6ee] text-[#047857] hover:bg-[#d1ecdc]"
              : "bg-[var(--color-bg-alt)] text-[#6b7280] hover:bg-[#eef1f5]"
          }`}
        >
          {row.isVisible ? (
            <>
              <Eye className="h-3 w-3" />
              공개
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" />
              비공개
            </>
          )}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="위로"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-white text-[#5f6363] transition-colors hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="아래로"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-white text-[#5f6363] transition-colors hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
      <td className="px-4 py-3 pr-5 text-right">
        <button
          type="button"
          onClick={onDelete}
          aria-label="삭제"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  );
}
