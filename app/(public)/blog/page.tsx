import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/lib/validations";

/**
 * /blog — 공개 블로그 목록 (기획문서 3.2 + Maki /blog 매칭).
 *
 * - H1: 68px / 500 / line-height 100% (Maki title-xl)
 * - 카드 (Maki .c_resource_card):
 *     border 1px #E3F0E7, radius 8px, flex-col
 *     cover (16:9 이미지) + content (tag + 제목 + 설명)
 *     tag 12px uppercase, 제목 20px (p 태그), 설명 16px
 * - SSR + ISR 60s
 */

export const revalidate = 60;

export const metadata: Metadata = {
  title: "블로그",
  description:
    "AI 채용 · HR 인사이트 · 고객 사례 · 제품 업데이트 등 슈퍼코더의 최신 글을 읽어보세요.",
};

type SearchParams = Promise<{ category?: string }>;

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const activeCategory =
    params.category &&
    (BLOG_CATEGORIES as readonly string[]).includes(params.category)
      ? (params.category as (typeof BLOG_CATEGORIES)[number])
      : null;

  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      ...(activeCategory ? { category: activeCategory } : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 60,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      thumbnail: true,
      category: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="bg-white">
      {/* Header — Maki title-xl */}
      <div className="wp-container pb-10 pt-16 md:pb-12 md:pt-20 lg:pt-24">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            Blog
          </span>
          <h1 className="mt-4 text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4.25rem]">
            슈퍼코더의
            <br />
            최신 인사이트
          </h1>
          <p className="mt-6 max-w-xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            AI 채용 · HR 인사이트 · 고객 사례 · 제품 업데이트. 슈퍼코더 팀이
            직접 쓴 글입니다.
          </p>
        </div>
      </div>

      {/* Category filter — 굵은 tab 스타일 */}
      <div className="wp-container">
        <nav
          aria-label="카테고리 필터"
          className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] pb-0"
        >
          <CategoryTab
            label="전체"
            active={activeCategory === null}
            href="/blog"
          />
          {BLOG_CATEGORIES.map((c) => (
            <CategoryTab
              key={c}
              label={BLOG_CATEGORY_LABELS[c]}
              active={activeCategory === c}
              href={`/blog?category=${c}`}
            />
          ))}
        </nav>
      </div>

      {/* 카드 그리드 */}
      <div className="wp-container py-10 md:py-12 lg:py-16">
        {posts.length === 0 ? (
          <EmptyState hasFilter={activeCategory !== null} />
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7">
            {posts.map((post) => (
              <li key={post.id}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Category tab ─────────────────────────────────────────────────
function CategoryTab({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex h-12 items-center px-4 text-[14px] font-medium transition-colors ${
        active
          ? "text-[var(--color-primary)]"
          : "text-[#5f6363] hover:text-[#282828]"
      }`}
    >
      {label}
      {active && (
        <span
          aria-hidden
          className="absolute -bottom-px left-0 h-[2px] w-full bg-[var(--color-primary)]"
        />
      )}
    </Link>
  );
}

// ── Blog card (Maki .c_resource_card 매칭) ──────────────────────────
type BlogCardPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  category: (typeof BLOG_CATEGORIES)[number];
  publishedAt: Date | null;
  createdAt: Date;
};

function BlogCard({ post }: { post: BlogCardPost }) {
  const date = post.publishedAt ?? post.createdAt;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#e3f0e7] bg-white transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-md"
    >
      {/* Cover (이미지) — 16:9 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-primary-light)]">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-[var(--color-primary)]">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content area — Maki .c_resource_card--content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {/* 카테고리 태그 — 12px uppercase #091010 */}
        <span className="text-[12px] font-medium uppercase leading-[1.3] tracking-wide text-[#091010]">
          {BLOG_CATEGORY_LABELS[post.category]}
        </span>

        {/* 제목 — 20px / #282828 (Maki 는 p 태그 사용하지만 시맨틱을 위해 h2 유지) */}
        <h2 className="text-[20px] font-medium leading-[1.3] text-[#282828] transition-colors group-hover:text-[var(--color-primary)]">
          {post.title}
        </h2>

        {/* Description — 16px / #5F6363 */}
        {post.excerpt && (
          <p className="line-clamp-2 text-[16px] font-normal leading-[1.5] text-[#5f6363]">
            {post.excerpt}
          </p>
        )}

        {/* Footer — 날짜 + Read more */}
        <div className="mt-auto flex items-center justify-between pt-4 text-[12px] text-[#9ca3af]">
          <time dateTime={date.toISOString()}>{formatDate(date)}</time>
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-primary)]">
            Read more
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Empty state ──────────────────────────────────────────────────
function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-[var(--color-border)] bg-[#fafbfc] px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M12 2v4M5.6 5.6l2.83 2.83M2 12h4M5.6 18.4l2.83-2.83M12 18v4M18.4 18.4l-2.83-2.83M22 12h-4M18.4 5.6l-2.83 2.83" />
        </svg>
      </div>
      <p className="text-[16px] font-medium text-[#282828]">
        {hasFilter
          ? "이 카테고리의 글이 아직 없습니다"
          : "아직 발행된 글이 없습니다"}
      </p>
      <p className="max-w-md text-[13px] leading-[1.5] text-[#5f6363]">
        {hasFilter
          ? "다른 카테고리를 선택하거나, 전체 글을 둘러보세요."
          : "새 글이 발행되면 이곳에 표시됩니다."}
      </p>
      {hasFilter && (
        <Link
          href="/blog"
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          전체 글 보기
        </Link>
      )}
    </div>
  );
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
