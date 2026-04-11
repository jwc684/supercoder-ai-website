import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/lib/validations";
import { getStaticPageMeta } from "@/lib/seo";
import { BlogFooterCta } from "@/components/landing/BlogFooterCta";

/**
 * /blog — 공개 블로그 목록 (Maki /blog 매칭).
 *
 * - H1 g_title--xl 68px / 500 / 100%
 * - 카테고리 필터 (탭 스타일, URL 쿼리 ?category=...)
 * - 페이지네이션 (9/page, URL 쿼리 ?page=N)
 * - Footer CTA + 4 stat cards (공용 컴포넌트 재사용)
 * - SSR + ISR 60s
 */

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/blog");
}

const POSTS_PER_PAGE = 9;

type SearchParams = Promise<{ category?: string; page?: string }>;

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // 카테고리 파라미터 검증
  const activeCategory =
    params.category &&
    (BLOG_CATEGORIES as readonly string[]).includes(params.category)
      ? (params.category as (typeof BLOG_CATEGORIES)[number])
      : null;

  // 페이지 파라미터 검증 (1부터 시작)
  const rawPage = Number(params.page);
  const currentPage =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const where = {
    status: "PUBLISHED" as const,
    ...(activeCategory ? { category: activeCategory } : {}),
  };

  const [totalCount, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
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
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));
  const normalizedPage = Math.min(currentPage, totalPages);

  // 쿼리 빌더 헬퍼 — 카테고리 유지 + 페이지 변경
  const buildHref = (page: number) => {
    const qp = new URLSearchParams();
    if (activeCategory) qp.set("category", activeCategory);
    if (page > 1) qp.set("page", String(page));
    const qs = qp.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <div className="bg-white">
      {/* ────────────── 1. Header — g_title--xl ────────────── */}
      <div className="wp-container pb-10 pt-16 md:pb-12 md:pt-24 lg:pt-28">
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

      {/* ────────────── 2. 카테고리 필터 탭 ────────────── */}
      <div className="wp-container">
        <nav
          aria-label="카테고리 필터"
          className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)]"
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

      {/* ────────────── 3. 카드 그리드 ────────────── */}
      <div className="wp-container py-10 md:py-12 lg:py-16">
        {posts.length === 0 ? (
          <EmptyState hasFilter={activeCategory !== null} />
        ) : (
          <>
            <ul className="grid gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7">
              {posts.map((post) => (
                <li key={post.id}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>

            {/* 페이지네이션 — Maki .c_cms_grid_3--pagination 매칭 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={normalizedPage}
                totalPages={totalPages}
                buildHref={buildHref}
              />
            )}
          </>
        )}
      </div>

      {/* ────────────── 4. Footer CTA (공용) ────────────── */}
      <BlogFooterCta />
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

// ── Pagination ───────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="페이지 탐색"
      className="mt-14 flex items-center justify-center gap-4 md:mt-16"
    >
      {/* Prev */}
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-4 text-[13px] font-medium text-[#5f6363] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous
        </Link>
      ) : (
        <span
          aria-hidden
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--color-border)]/60 bg-white px-4 text-[13px] font-medium text-[#cbd5e0]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous
        </span>
      )}

      {/* Counter */}
      <p className="text-[13px] font-medium text-[#282828]">
        {currentPage} <span className="text-[#9ca3af]">/</span>{" "}
        <span className="text-[#5f6363]">{totalPages}</span>
      </p>

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Next
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span
          aria-hidden
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--color-border)]/60 bg-white px-4 text-[13px] font-medium text-[#cbd5e0]"
        >
          Next
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </nav>
  );
}

// ── Blog card — Maki .c_resource_card 매칭 ──────────────────────
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
      {/* Cover */}
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

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-[12px] font-medium uppercase leading-[1.3] tracking-wide text-[#091010]">
          {BLOG_CATEGORY_LABELS[post.category]}
        </span>
        <h2 className="text-[20px] font-medium leading-[1.3] text-[#282828] transition-colors group-hover:text-[var(--color-primary)]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="line-clamp-3 text-[16px] font-normal leading-[1.5] text-[#5f6363]">
            {post.excerpt}
          </p>
        )}
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
              <path
                d="M5 12h14M13 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
