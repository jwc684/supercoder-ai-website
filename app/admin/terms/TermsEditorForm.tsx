"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Trash2, CheckCircle2, Circle } from "lucide-react";
import { RichEditor, type RichEditorContent } from "@/components/admin/RichEditor";
import {
  TERMS_TYPES,
  TERMS_TYPE_LABELS,
} from "@/lib/validations";

type FormState = {
  title: string;
  type: (typeof TERMS_TYPES)[number];
  version: string;
  effectiveDate: string; // datetime-local
  content: RichEditorContent | null;
};

type TermsEditorFormProps = {
  mode: "new" | "edit";
  termsId?: string;
  initialIsActive?: boolean;
  initial?: Partial<FormState>;
};

const EMPTY_CONTENT: RichEditorContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function TermsEditorForm({
  mode,
  termsId,
  initialIsActive = false,
  initial,
}: TermsEditorFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    type: initial?.type ?? "PRIVACY",
    version: initial?.version ?? "1.0",
    effectiveDate: initial?.effectiveDate ?? "",
    content: initial?.content ?? EMPTY_CONTENT,
  });

  const [isActive, setIsActive] = useState(initialIsActive);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleContentChange = (json: RichEditorContent) => {
    setForm((prev) => ({ ...prev, content: json }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("약관명을 입력해주세요");
      return;
    }
    if (!form.effectiveDate) {
      toast.error("시행일을 선택해주세요");
      return;
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      version: form.version.trim() || "1.0",
      effectiveDate: new Date(form.effectiveDate).toISOString(),
      content: form.content ?? EMPTY_CONTENT,
    };

    setSaving(true);
    try {
      const res = await fetch(
        mode === "new" ? "/api/terms" : `/api/terms/${termsId}`,
        {
          method: mode === "new" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "저장 실패");

      toast.success(
        mode === "new"
          ? "약관이 생성되었습니다. (비활성 상태)"
          : "저장되었습니다.",
      );
      if (mode === "new") {
        router.push(`/admin/terms/${json.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`저장 실패: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "edit" || !termsId) return;
    if (!window.confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/terms/${termsId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "삭제 실패");
      toast.success("삭제되었습니다.");
      router.push("/admin/terms");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`삭제 실패: ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    if (mode !== "edit" || !termsId) return;

    const nextActive = !isActive;
    const confirmMsg = nextActive
      ? `활성화하면 동일한 유형(${TERMS_TYPE_LABELS[form.type]})의 기존 활성 약관이 자동으로 비활성화됩니다. 계속할까요?`
      : "비활성화하면 공개 페이지에서 약관이 더 이상 표시되지 않습니다. 계속할까요?";

    if (!window.confirm(confirmMsg)) return;

    setToggling(true);
    try {
      const res = await fetch(`/api/terms/${termsId}/activate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextActive }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "토글 실패");

      setIsActive(nextActive);
      toast.success(
        nextActive
          ? "약관이 활성화되었습니다. 공개 페이지에 즉시 반영됩니다."
          : "약관이 비활성화되었습니다.",
      );
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`토글 실패: ${msg}`);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      {/* Main: 제목 + 에디터 */}
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <label className="block text-[12px] font-medium text-[#5f6363]">
            약관명
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="예) 슈퍼코더 개인정보처리방침"
            className="mt-2 w-full border-0 bg-transparent text-[24px] font-medium leading-[1.2] text-[#282828] placeholder:text-[#9ca3af] focus:outline-none md:text-[28px]"
          />
        </div>

        <RichEditor
          initialContent={form.content}
          onChange={handleContentChange}
          placeholder="약관 본문을 작성하세요…"
        />
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-5">
        {/* 저장 + 삭제 */}
        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving
              ? "저장 중…"
              : mode === "new"
                ? "약관 생성"
                : "변경사항 저장"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-error)]/20 bg-white px-4 text-[12px] font-semibold text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/5 disabled:opacity-60"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              삭제
            </button>
          )}
        </div>

        {/* 활성화 토글 — edit 모드에서만 */}
        {mode === "edit" && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
              공개 상태
            </p>
            <p className="mt-1 text-[12px] leading-[1.5] text-[#9ca3af]">
              활성화하면 공개 페이지에 즉시 반영됩니다. 동일 유형의 기존 활성
              약관은 자동 비활성화됩니다.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {isActive ? (
                <span className="inline-flex flex-1 items-center gap-2 rounded-lg bg-[#f0fdf4] px-3 py-2 text-[13px] font-semibold text-[#16a34a] ring-1 ring-inset ring-[#bbf7d0]">
                  <CheckCircle2 className="h-4 w-4" />
                  활성화 됨
                </span>
              ) : (
                <span className="inline-flex flex-1 items-center gap-2 rounded-lg bg-[#f8f9fa] px-3 py-2 text-[13px] font-semibold text-[#5f6363] ring-1 ring-inset ring-[var(--color-border)]">
                  <Circle className="h-4 w-4" />
                  비활성화
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleToggleActive}
              disabled={toggling}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-[12px] font-semibold text-[#282828] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:opacity-60"
            >
              {toggling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {toggling
                ? "처리 중…"
                : isActive
                  ? "비활성화하기"
                  : "활성화하기"}
            </button>
          </div>
        )}

        {/* 메타 정보 */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            메타 정보
          </p>

          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              유형
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as FormState["type"],
                }))
              }
              className="mt-2 h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] text-[#282828] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            >
              {TERMS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TERMS_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              버전
            </label>
            <input
              type="text"
              value={form.version}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, version: e.target.value }))
              }
              placeholder="1.0"
              className="mt-2 h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] text-[#282828] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              시행일
            </label>
            <input
              type="datetime-local"
              value={form.effectiveDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, effectiveDate: e.target.value }))
              }
              className="mt-2 h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] text-[#282828] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
