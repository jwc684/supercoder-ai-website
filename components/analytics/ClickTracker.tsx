"use client";

import { useEffect } from "react";
import { enqueue } from "@/lib/analytics/queue";

/**
 * ClickTracker — document 레벨 이벤트 위임.
 *
 * `data-track="label"` 속성이 있는 요소를 클릭하면
 * `cta_click` 이벤트 발사. 버튼 추가/제거 시 코드 수정 불필요.
 *
 * (public) layout 에 1회 배치.
 */
export function ClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-track]",
      );
      if (!target) return;
      const label = target.dataset.track;
      if (!label) return;
      enqueue({
        type: "cta_click",
        path: location.pathname,
        label,
      });
    };

    document.addEventListener("click", handler, { passive: true });
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
