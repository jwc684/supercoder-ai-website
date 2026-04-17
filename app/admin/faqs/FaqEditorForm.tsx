"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Trash2, CheckCircle2, Circle } from "lucide-react";
import { RichEditor, type RichEditorContent } from "@/components/admin/RichEditor";

type FormState = {
  question: string;
  answer: RichEditorContent | null;
};

type FaqEditorFormProps = {
  mode: "new" | "edit";
  faqId?: string;
  initialIsPublished?: boolean;
  initial?: Partial<FormState>;
};

const EMPTY_ANSWER: RichEditorContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function FaqEditorForm({
  mode,
  faqId,
  initialIsPublished,
  initial,
}: FaqEditorFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    question: initial?.question ?? "",
    answer: initial?.answer ?? EMPTY_ANSWER,
  });

  // 새 FAQ 는 기본값을 "공개" 로 — 저장 한 번이면 랜딩에 반영된다.
  // 수정은 기존 DB 값을 그대로 유지.
  const [isPublished, setIsPublished] = useState(
    initialIsPublished ?? (mode === "new"),
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAnswerChange = (json: RichEditorContent) => {
    setForm((prev) => ({ ...prev, answer: json }));
  };

  const handleSave = async () => {
    if (!form.question.trim()) {
      toast.error("질문을 입력해주세요");
      return;
    }

    const payload = {
      question: form.question.trim(),
      answer: form.answer ?? EMPTY_ANSWER,
      isPublished,
    };

    setSaving(true);
    try {
      const res = await fetch(
        mode === "new" ? "/api/faqs" : `/api/faqs/${faqId}`,
        {
          method: mode === "new" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "저장 실패");

      toast.success(
        mode === "new" ? "FAQ 가 생성되었습니다." : "저장되었습니다.",
      );
      if (mode === "new") {
        router.push(`/admin/faqs/${json.id}`);
      } else {
        router.push("/admin/faqs");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`저장 실패: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "edit" || !faqId) return;
    if (!window.confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/faqs/${faqId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "삭제 실패");
      toast.success("삭제되었습니다.");
      router.push("/admin/faqs");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`삭제 실패: ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      {/* Main: 질문 + 에디터 */}
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <label className="block text-[12px] font-medium text-[#5f6363]">
            질문
          </label>
          <input
            type="text"
            value={form.question}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, question: e.target.value }))
            }
            placeholder="예) 슈퍼코더 AI Interviewer 는 무엇인가요?"
            className="mt-2 w-full border-0 bg-transparent text-[22px] font-medium leading-[1.3] text-[#282828] placeholder:text-[#9ca3af] focus:outline-none md:text-[24px]"
          />
        </div>

        <RichEditor
          initialContent={form.answer}
          onChange={handleAnswerChange}
          placeholder="답변을 작성하세요…"
        />
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-5">
        {/* 공개 상태 — 최상단에 배치해서 저장 전 상태를 분명히 인지하게 함 */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            공개 상태
          </p>
          <p className="mt-1 text-[12px] leading-[1.5] text-[#9ca3af]">
            공개 상태로 저장하면 랜딩 페이지 FAQ 섹션에 즉시 노출됩니다.
          </p>

          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-[#f8f9fa] p-3">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold">
              {isPublished ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                  <span className="text-[#16a34a]">공개</span>
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 text-[#5f6363]" />
                  <span className="text-[#5f6363]">비공개</span>
                </>
              )}
            </span>
            {/* 접근성 + 상태 토글 */}
            <span
              role="switch"
              aria-checked={isPublished}
              tabIndex={0}
              onClick={() => setIsPublished((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setIsPublished((v) => !v);
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                isPublished
                  ? "bg-[var(--color-primary)]"
                  : "bg-[#cbd5e0]"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  isPublished ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </span>
          </label>

          <p className="mt-3 text-[11px] leading-[1.5] text-[#9ca3af]">
            토글만 눌러서는 저장되지 않습니다. 아래 저장 버튼을 눌러 최종
            반영하세요.
          </p>
        </div>

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
                ? isPublished
                  ? "공개로 저장"
                  : "비공개로 저장"
                : isPublished
                  ? "공개 상태로 저장"
                  : "비공개 상태로 저장"}
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
      </aside>
    </div>
  );
}
