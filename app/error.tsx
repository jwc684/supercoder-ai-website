"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";

/**
 * 전역 error boundary — 렌더링 중 예외 발생 시 표시.
 * `reset()` 으로 재시도 가능. `error.digest` 는 서버 로그 상관관계용.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error] boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white py-20">
      <div className="wp-container">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-error)]">
            500 · Something went wrong
          </p>
          <h1 className="mt-4 text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4rem]">
            일시적인 오류가
            <br />
            발생했습니다
          </h1>
          <p className="mt-6 text-[16px] leading-[1.55] text-[#5f6363] md:text-[18px]">
            잠시 후 다시 시도해주세요. 문제가 계속되면 담당자에게 문의
            부탁드립니다.
          </p>
          {error.digest && (
            <p className="mt-3 font-mono text-[11px] text-[#9ca3af]">
              Ref: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <RotateCcw className="h-4 w-4" />
              다시 시도
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
            >
              도움 요청
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
