"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";

type FaqAccordionItemProps = {
  question: string;
  answerHtml: string;
  defaultOpen?: boolean;
};

/**
 * 단일 FAQ 카드 — Maki .c_faq--card 매칭.
 * Schema.org Question/Answer microdata 포함.
 * 클라이언트에서 아코디언 open/close 제어.
 */
export function FaqAccordionItem({
  question,
  answerHtml,
  defaultOpen = false,
}: FaqAccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const answerId = useId();

  return (
    <div
      itemScope
      itemType="https://schema.org/Question"
      itemProp="mainEntity"
      className="border-b border-[var(--color-border)]"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={answerId}
        className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors hover:text-[var(--color-primary)] md:py-7"
      >
        <p
          itemProp="name"
          className="text-[17px] font-medium leading-[1.45] text-[#282828] md:text-[20px] md:leading-[30px]"
        >
          {question}
        </p>
        <span
          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[#5f6363] transition-transform ${
            open ? "rotate-180 border-[var(--color-primary)]/40 text-[var(--color-primary)]" : ""
          }`}
          aria-hidden
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div
        id={answerId}
        itemScope
        itemType="https://schema.org/Answer"
        itemProp="acceptedAnswer"
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          open
            ? "grid-rows-[1fr] pb-6 opacity-100 md:pb-7"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            itemProp="text"
            className="prose-blog max-w-none pr-12 text-[15px] leading-[1.65] text-[#5f6363] md:text-[16px]"
            dangerouslySetInnerHTML={{ __html: answerHtml }}
          />
        </div>
      </div>
    </div>
  );
}
