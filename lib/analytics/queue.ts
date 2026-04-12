import { getSessionId } from "./session";

/**
 * 이벤트 배치 큐.
 *
 * 이벤트 발생 → 메모리 큐에 push → 10개 또는 5초마다 flush.
 * pagehide/visibilitychange(hidden) 시 최종 flush.
 *
 * 전송: navigator.sendBeacon 우선 (탭 닫아도 안전), fallback fetch(keepalive).
 */

export type AnalyticsEvent = {
  type: "section_view" | "cta_click" | "dwell";
  path: string;
  section?: string;
  label?: string;
  value?: number;
};

const FLUSH_INTERVAL_MS = 5_000;
const FLUSH_BATCH_SIZE = 10;

let queue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function enqueue(event: AnalyticsEvent) {
  queue.push(event);
  if (queue.length >= FLUSH_BATCH_SIZE) {
    flush();
  } else {
    scheduleFlush();
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, FLUSH_INTERVAL_MS);
}

export function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (queue.length === 0) return;

  const batch = queue.splice(0);
  const body = JSON.stringify({
    sessionId: getSessionId(),
    events: batch,
  });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        /* silent — UX 무영향 */
      });
    }
  } catch {
    /* silent */
  }
}

// 페이지 떠날 때 최종 flush
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}
