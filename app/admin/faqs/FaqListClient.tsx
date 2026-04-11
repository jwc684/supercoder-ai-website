"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Circle,
  Edit,
  Loader2,
  Trash2,
} from "lucide-react";

type FaqRow = {
  id: string;
  question: string;
  order: number;
  isPublished: boolean;
  updatedAt: string;
};

type FaqListClientProps = {
  initialFaqs: FaqRow[];
};

/**
 * FaqListClient — 관리자 FAQ 목록.
 * - 위/아래 화살표로 순서 조정 (낙관적 업데이트 + PATCH /api/faqs/reorder)
 * - 공개 토글 (PUT /api/faqs/[id])
 * - 삭제
 * 드래그 앤 드롭 대신 ↑↓ 버튼 — 라이브러리 의존 없이 안정적이고 모바일 친화적.
 */
export function FaqListClient({ initialFaqs }: FaqListClientProps) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqRow[]>(initialFaqs);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [reordering, startReorder] = useTransition();

  const markPending = (id: string, on: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;

    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    // order 를 0부터 연속된 값으로 재부여
    const normalized = next.map((f, i) => ({ ...f, order: i }));
    setFaqs(normalized);

    const payload = normalized.map((f) => ({ id: f.id, order: f.order }));
    startReorder(async () => {
      try {
        const res = await fetch("/api/faqs/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payload }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "재배치 실패");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "알 수 없는 오류";
        toast.error(`순서 저장 실패: ${msg}`);
        // 실패 시 원상 복구
        setFaqs(initialFaqs);
      }
    });
  };

  const togglePublish = async (faq: FaqRow) => {
    markPending(faq.id, true);
    try {
      // PUT 은 전체 스키마를 요구하므로, question/answer 를 먼저 가져와야 함.
      const cur = await fetch(`/api/faqs/${faq.id}`).then((r) => r.json());
      if (!cur.ok) throw new Error(cur.error ?? "조회 실패");

      const res = await fetch(`/api/faqs/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: cur.faq.question,
          answer: cur.faq.answer,
          order: cur.faq.order,
          isPublished: !faq.isPublished,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "토글 실패");

      setFaqs((prev) =>
        prev.map((f) =>
          f.id === faq.id ? { ...f, isPublished: !f.isPublished } : f,
        ),
      );
      toast.success(
        !faq.isPublished
          ? "공개되었습니다. 랜딩 페이지에 즉시 반영됩니다."
          : "비공개로 전환되었습니다.",
      );
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`토글 실패: ${msg}`);
    } finally {
      markPending(faq.id, false);
    }
  };

  const handleDelete = async (faq: FaqRow) => {
    if (!window.confirm(`"${faq.question}" 을(를) 삭제하시겠습니까?`)) return;
    markPending(faq.id, true);
    try {
      const res = await fetch(`/api/faqs/${faq.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "삭제 실패");
      setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
      toast.success("삭제되었습니다.");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`삭제 실패: ${msg}`);
    } finally {
      markPending(faq.id, false);
    }
  };

  if (faqs.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-[#fafbfc] px-6 py-16 text-center">
        <p className="text-[14px] font-medium text-[#282828]">
          아직 등록된 FAQ 가 없습니다.
        </p>
        <p className="mt-1 text-[13px] text-[#5f6363]">
          상단 &quot;새 FAQ 작성&quot; 버튼으로 시작하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white">
      <table className="w-full min-w-[800px] text-left">
        <thead className="bg-[#fafbfc]">
          <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            <th className="w-20 px-4 py-3">순서</th>
            <th className="px-4 py-3">질문</th>
            <th className="w-28 px-4 py-3">상태</th>
            <th className="w-32 px-4 py-3">수정일</th>
            <th className="w-40 px-4 py-3 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq, idx) => {
            const pending = pendingIds.has(faq.id) || reordering;
            return (
              <tr
                key={faq.id}
                className="border-b border-[var(--color-border)] last:border-0 transition-colors hover:bg-[#f8f9fa]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0 || reordering}
                      title="위로"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#5f6363] transition-colors hover:bg-[#f0f1f3] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === faqs.length - 1 || reordering}
                      title="아래로"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#5f6363] transition-colors hover:bg-[#f0f1f3] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <span className="ml-1 text-[11px] text-[#9ca3af]">
                      {idx + 1}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/faqs/${faq.id}`}
                    className="line-clamp-2 text-[13px] font-medium text-[#282828] hover:text-[var(--color-primary)]"
                  >
                    {faq.question}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => togglePublish(faq)}
                    disabled={pending}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset transition-colors disabled:opacity-60 ${
                      faq.isPublished
                        ? "bg-[#f0fdf4] text-[#16a34a] ring-[#bbf7d0] hover:bg-[#dcfce7]"
                        : "bg-[#f8f9fa] text-[#5f6363] ring-[var(--color-border)] hover:bg-[#f0f1f3]"
                    }`}
                  >
                    {pending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : faq.isPublished ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                    {faq.isPublished ? "공개" : "비공개"}
                  </button>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5f6363]">
                  {formatDate(faq.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/faqs/${faq.id}`}
                      title="편집"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] hover:bg-[#f0f1f3] hover:text-[var(--color-primary)]"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(faq)}
                      disabled={pending}
                      title="삭제"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] transition-colors hover:bg-[#fef0ef] hover:text-[var(--color-error)] disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(d: string): string {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
