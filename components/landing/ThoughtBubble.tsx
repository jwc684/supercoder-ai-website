import type { ReactNode } from "react";

/**
 * ThoughtBubble — 섹션 전환부에서 방문자의 '속마음' 을 보여주는 내러티브 칩.
 * v3 레퍼런스의 💭 inline quote 를 라이트 테마로 포팅.
 */
export function ThoughtBubble({
  children,
  align = "right",
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
}) {
  const justify =
    align === "center"
      ? "justify-center"
      : align === "left"
        ? "justify-start"
        : "justify-end";

  return (
    <div className={`flex ${justify}`}>
      <div className="inline-flex max-w-[560px] items-start gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-3">
        <span aria-hidden className="mt-[2px] shrink-0 text-[14px] leading-none">
          💭
        </span>
        <p className="text-[13px] italic leading-[1.6] text-[#5f6363]">
          {children}
        </p>
      </div>
    </div>
  );
}
