import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

/**
 * 전역 404 — 라우트를 찾을 수 없을 때 표시.
 * 브랜드 톤에 맞춘 간결한 중앙 정렬 레이아웃.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white py-20">
      <div className="wp-container">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            404 · Not Found
          </p>
          <h1 className="mt-4 text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4rem]">
            페이지를
            <br />
            찾을 수 없습니다
          </h1>
          <p className="mt-6 text-[16px] leading-[1.55] text-[#5f6363] md:text-[18px]">
            요청하신 페이지가 이동되었거나, 더 이상 존재하지 않을 수 있습니다.
            홈으로 돌아가거나 다른 경로를 확인해 주세요.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              <Home className="h-4 w-4" />
              홈으로
            </Link>
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
