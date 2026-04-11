"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * PageViewTracker — 클라이언트 사이드 페이지 방문 기록.
 *
 * usePathname 으로 경로 변경을 감지하고 POST /api/page-views 로 append.
 * (public) layout 에 한 번 배치되어 모든 공개 페이지를 커버.
 *
 * navigator.sendBeacon 을 우선 사용해서 라우트 이탈 시에도 안전하게 전송.
 * sendBeacon 미지원 환경 (일부 구형 브라우저) 에선 fetch keepalive 로 fallback.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  // 같은 경로로 중복 호출되지 않도록 마지막 전송 경로를 추적
  const lastSentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastSentRef.current === pathname) return;

    // 관리자 페이지 / API 는 스킵 (서버도 거르지만 네트워크 호출 자체를 절약)
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    lastSentRef.current = pathname;
    const payload = {
      path: pathname,
      referer: document.referrer || null,
    };
    const body = JSON.stringify(payload);

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/page-views", blob);
      } else {
        fetch("/api/page-views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {
          /* 실패 무시 — UX 영향 없어야 함 */
        });
      }
    } catch {
      /* 실패 무시 */
    }
  }, [pathname]);

  return null;
}
