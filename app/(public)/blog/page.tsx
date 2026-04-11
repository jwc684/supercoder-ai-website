import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/lib/validations";
import { estimateReadingTime } from "@/lib/tiptap";

/**
 * /blog — 공개 블로그 목록 (기획문서 3.2).
 *
 * SSR + ISR (60초 재검증). URL 쿼리 기반 카테고리 필터.
 * Status=PUBLISHED 만 노출.
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
    params.category && (BLOG_CATEGORIES as readonly string[]).includes(params.category)
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
      tags: true,
      publishedAt: true,
      createdAt: true,
      content: true,
    },
  });

  return (
    <div className="bg-white">
      {/* Header — wp-container 안에 타이틀 + 카테고리 필터 */}
      <div className="wp-container py-16 md:py-24 lg:py-28">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            Blog
          </span>
          <h1 className="mt-4 text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4.25rem]">
            AI 채용의
            <br />
            최신 인사이트
          </h1>
          <p className="mt-6 max-w-xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            AI 채용 · HR 인사이트 · 고객 사례 · 제품 업데이트. 슈퍼코더 팀이
            직접 쓴 글입니다.
          </p>
        </div>

        {/* 카테고리 필터 칩 */}
        <nav
          aria-label="카테고리 필터"
          className="mt-10 flex flex-wrap items-center gap-2 md:mt-12"
        >
          <CategoryChip
            label="전체"
            active={activeCategory === null}
            href="/blog"
          />
          {BLOG_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              label={BLOG_CATEGORY_LABELS[c]}
              active={activeCategory === c}
              href={`/blog?category=${c}`}
            />
          ))}
        </nav>

        {/* 카드 그리드 */}
        <div className="mt-10 md:mt-12">
          {posts.length === 0 ? (
            <EmptyState hasFilter={activeCategory !== null} />
          ) : (
            <ul className="grid gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {posts.map((post) => (
                <li key={post.id}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Category chip ────────────────────────────────────────────────
function CategoryChip({
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
      className={`inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
        active
          ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[#5f6363] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
      }`}
    >
      {label}
    </Link>
  );
}

// ── Blog card ────────────────────────────────────────────────────
type BlogCardPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  category: (typeof BLOG_CATEGORIES)[number];
  tags: string[];
  publishedAt: Date | null;
  createdAt: Date;
  content: unknown;
};

function BlogCard({ post }: { post: BlogCardPost }) {
  const readMin = estimateReadingTime(post.content);
  const date = post.publishedAt ?? post.createdAt;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-lg"
    >
      {/* Thumbnail */}
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

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
            {BLOG_CATEGORY_LABELS[post.category]}
          </span>
          <span className="text-[11px] text-[#9ca3af]">·</span>
          <span className="text-[11px] text-[#9ca3af]">{readMin} 분 읽기</span>
        </div>

        <h2 className="text-[18px] font-semibold leading-[1.35] text-[#282828] transition-colors group-hover:text-[var(--color-primary)] md:text-[19px]">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="line-clamp-2 text-[13.5px] leading-[1.55] text-[#5f6363]">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-[#9ca3af]">
          <time dateTime={date.toISOString()}>{formatDate(date)}</time>
        </div>
      </div>
    </Link>
  );
}

// ── Empty state ──────────────────────────────────────────────────
function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-[var(--color-border)] bg-[#fafbfc] px-6 py-20 text-center">
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
        {hasFilter ? "이 카테고리의 글이 아직 없습니다" : "아직 발행된 글이 없습니다"}
      </p>
      <p className="max-w-md text-[13px] leading-[1.5] text-[#5f6363]">
        {hasFilter
          ? "다른 카테고리를 선택하거나, 전체 글을 둘러보세요."
          : "새 글이 발행되면 이곳에 표시됩니다. 조금만 기다려주세요."}
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
