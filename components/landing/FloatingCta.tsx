"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

/**
 * FloatingCta — 모바일 전용 고정 CTA 바.
 * 기획문서 3.1 — "Floating CTA (모바일)"
 *
 * 동작:
 *   - 모바일 뷰포트 (<lg 1024px) 에서만 표시
 *   - hero 아래(≈500px) 까지 스크롤 시 슬라이드업 등장
 *   - 사용자가 닫으면 세션 동안 숨김 (sessionStorage)
 *   - 하단 안전영역 (safe-area-inset-bottom) 대응
 */
export function FloatingCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // 세션 저장소에서 dismissed 상태 로드
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("floating-cta-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  // 스크롤 감지
  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("floating-cta-dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  if (dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="pointer-events-auto mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-[#0b1b4a] p-3 shadow-2xl ring-1 ring-white/10">
        {/* 좌측: 아이콘 + 간단 카피 */}
        <div className="flex min-w-0 flex-1 items-center gap-3 pl-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
            <span className="text-[16px] font-bold">K</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-white/70">
              AI Agent 채용
            </p>
            <p className="truncate text-[14px] font-semibold text-white">
              코비와 3분이면 충분합니다
            </p>
          </div>
        </div>

        {/* 우측: CTA + 닫기 */}
        <Link
          href="/contact"
          data-track="cta_floating_inquiry"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          도입 문의
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="고정 CTA 닫기"
          className="inline-flex h-10 w-8 shrink-0 items-center justify-center text-white/50 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
