"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Download,
  FileText,
  Loader2,
  Trash2,
  Upload,
  CheckCircle2,
} from "lucide-react";

type BrochureRow = {
  id: string;
  filename: string;
  url: string;
  size: number;
  mime: string;
  createdAt: string;
};

type BrochureClientProps = {
  initialBrochures: BrochureRow[];
};

const MAX_SIZE = 20 * 1024 * 1024;

export function BrochureClient({ initialBrochures }: BrochureClientProps) {
  const router = useRouter();
  const [brochures, setBrochures] = useState<BrochureRow[]>(initialBrochures);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = brochures[0] ?? null; // createdAt desc → [0] is active
  const history = brochures.slice(1);

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // input 값 초기화해서 같은 파일도 재업로드 가능하게
    e.target.value = "";

    if (file.type !== "application/pdf") {
      toast.error("PDF 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("파일이 너무 큽니다 (최대 20MB).");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/brochure", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "업로드 실패");

      toast.success(
        "소개서가 업로드되었습니다. 공개 /download 페이지에 즉시 반영됩니다.",
      );
      setBrochures((prev) => [
        {
          ...json.brochure,
          createdAt: new Date(json.brochure.createdAt).toISOString(),
        },
        ...prev,
      ]);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`업로드 실패: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!window.confirm(`"${filename}" 을(를) 삭제하시겠습니까?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/brochure/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "삭제 실패");

      setBrochures((prev) => prev.filter((b) => b.id !== id));
      toast.success("삭제되었습니다.");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`삭제 실패: ${msg}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* 1. Upload 카드 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Upload
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-[1.3] text-[#282828] md:text-[20px]">
              새 소개서 파일 업로드
            </h2>
            <p className="mt-1 text-[13px] leading-[1.55] text-[#5f6363]">
              PDF · 최대 20 MB · 업로드 즉시 <span className="font-medium text-[#282828]">/download</span>{" "}
              페이지에 반영됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSelectFile}
            disabled={uploading}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "업로드 중…" : "PDF 파일 선택"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* 2. 현재 활성 브로셔 */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
          Current
        </p>
        <h2 className="mt-1 text-[18px] font-semibold leading-[1.3] text-[#282828] md:text-[20px]">
          현재 공개 중인 소개서
        </h2>

        {current ? (
          <div className="mt-4 flex flex-col gap-5 rounded-2xl border-2 border-[var(--color-primary)]/30 bg-[var(--color-primary-light)]/40 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-primary)] shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-semibold text-[#282828]">
                    {current.filename}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[11px] font-semibold text-[#16a34a] ring-1 ring-inset ring-[#bbf7d0]">
                    <CheckCircle2 className="h-3 w-3" />
                    활성
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-[#5f6363]">
                  {formatSize(current.size)} · 업로드{" "}
                  {formatDateTime(current.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={current.url}
                target="_blank"
                rel="noopener"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-[12px] font-semibold text-[#282828] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
              >
                <Download className="h-3.5 w-3.5" />
                열기
              </a>
              <button
                type="button"
                onClick={() => handleDelete(current.id, current.filename)}
                disabled={deletingId === current.id}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-error)]/20 bg-white px-4 text-[12px] font-semibold text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/5 disabled:opacity-60"
              >
                {deletingId === current.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                삭제
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[#fafbfc] px-6 py-10 text-center">
            <p className="text-[14px] font-medium text-[#282828]">
              업로드된 소개서가 없습니다
            </p>
            <p className="mt-1 text-[13px] text-[#5f6363]">
              공개 /download 페이지는 현재 기본 placeholder PDF 를 제공합니다.
              상단 &quot;PDF 파일 선택&quot; 버튼으로 업로드하세요.
            </p>
          </div>
        )}
      </div>

      {/* 3. 이전 버전 이력 */}
      {history.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            History
          </p>
          <h2 className="mt-1 text-[18px] font-semibold leading-[1.3] text-[#282828] md:text-[20px]">
            이전 버전 ({history.length})
          </h2>
          <p className="mt-1 text-[13px] text-[#5f6363]">
            과거 업로드 이력. 필요 없는 버전은 삭제해서 Storage 사용량을
            관리하세요.
          </p>

          <ul className="mt-4 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
            {history.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f8f9fa] text-[#5f6363]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#282828]">
                      {b.filename}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#9ca3af]">
                      {formatSize(b.size)} · {formatDateTime(b.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener"
                    title="열기"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] hover:bg-[#f0f1f3] hover:text-[var(--color-primary)]"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id, b.filename)}
                    disabled={deletingId === b.id}
                    title="삭제"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] transition-colors hover:bg-[#fef0ef] hover:text-[var(--color-error)] disabled:opacity-40"
                  >
                    {deletingId === b.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}
