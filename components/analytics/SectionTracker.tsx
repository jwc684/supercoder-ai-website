"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { enqueue } from "@/lib/analytics/queue";

/**
 * SectionTracker — IntersectionObserver 래퍼.
 *
 * children 을 감싸서 섹션이 뷰포트에 50% 이상 보이면
 * `section_view` 이벤트를 **세션 당 1회** 발사.
 *
 * 사용:
 *   <SectionTracker id="hero"><header>...</header></SectionTracker>
 */
export function SectionTracker({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;

    // sessionStorage 로 같은 세션 내 중복 방지
    const storageKey = `sc-sv-${id}`;
    if (sessionStorage.getItem(storageKey)) {
      firedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.5 && !firedRef.current) {
            firedRef.current = true;
            sessionStorage.setItem(storageKey, "1");
            enqueue({
              type: "section_view",
              path: location.pathname,
              section: id,
            });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div ref={ref} data-section={id}>
      {children}
    </div>
  );
}
