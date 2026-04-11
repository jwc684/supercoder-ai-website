"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/lib/validations";

/**
 * Admin 블로그 목록 toolbar — URL 쿼리 파라미터 기반 필터/검색.
 */
export function BlogListToolbar({
  initialStatus,
  initialCategory,
  initialQuery,
}: {
  initialStatus: string;
  initialCategory: string;
  initialQuery: string;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(search.toString());
      if (value && value !== "ALL" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `?${qs}` : "?");
      });
    },
    [router, search],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", query.trim() || null);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-4 md:flex-row md:items-center md:justify-between md:p-5">
      {/* Status + Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <FilterGroup label="상태">
          {(["ALL", "DRAFT", "PUBLISHED"] as const).map((s) => (
            <Chip
              key={s}
              label={s === "ALL" ? "전체" : s === "DRAFT" ? "초안" : "발행"}
              active={initialStatus === s}
              onClick={() =>
                updateParam("status", s === "ALL" ? null : s)
              }
            />
          ))}
        </FilterGroup>

        {/* Category */}
        <FilterGroup label="카테고리">
          <Chip
            label="전체"
            active={initialCategory === "ALL"}
            onClick={() => updateParam("category", null)}
          />
          {BLOG_CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={BLOG_CATEGORY_LABELS[c]}
              active={initialCategory === c}
              onClick={() => updateParam("category", c)}
            />
          ))}
        </FilterGroup>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목/슬러그 검색"
            className="h-10 w-full min-w-[220px] rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-3 text-[13px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 shrink-0 items-center rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
        >
          검색
        </button>
      </form>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[#5f6363] hover:border-[var(--color-primary)]/40"
      }`}
    >
      {label}
    </button>
  );
}
