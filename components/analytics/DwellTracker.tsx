"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { enqueue, flush } from "@/lib/analytics/queue";

/**
 * DwellTracker — 페이지 전체 체류 시간 측정.
 *
 * pathname 변경 시 시작 → unmount / visibilitychange(hidden) 시 종료.
 * 500ms~3,600,000ms (1시간) 범위만 유효.
 *
 * (public) layout 에 1회 배치.
 */
const MIN_DWELL_MS = 500;
const MAX_DWELL_MS = 3_600_000;

export function DwellTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // 관리자/API/내부 경로 제외
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    const startTs = performance.now();

    const sendDwell = () => {
      const ms = Math.round(performance.now() - startTs);
      if (ms >= MIN_DWELL_MS && ms <= MAX_DWELL_MS) {
        enqueue({ type: "dwell", path: pathname, value: ms });
        flush(); // 즉시 전송 (unmount 직전이므로)
      }
    };

    return sendDwell;
  }, [pathname]);

  return null;
}
