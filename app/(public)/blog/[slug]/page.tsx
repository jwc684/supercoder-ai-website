import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORY_LABELS } from "@/lib/validations";
import { renderTiptap, estimateReadingTime, extractPlainText } from "@/lib/tiptap";

/**
 * /blog/[slug] — 블로그 상세 페이지 (Maki /blog/:slug 구조 매칭).
 *
 * 레이아웃:
 *   1. Header section (6|5 split): text (category/h1/description/meta) + feature image 16:9
 *   2. Body section (7|4 split): article content + sticky dark CTA sidebar
 *   3. Related content section: H2 + 3 cards
 *   4. Footer CTA banner: full-width dark gradient
 *
 * SSG + ISR 60s. Tiptap JSON → HTML server-side render.
 */

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      seoTitle: true,
      seoDesc: true,
      excerpt: true,
      thumbnail: true,
      content: true,
      status: true,
      publishedAt: true,
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    return { title: "찾을 수 없는 글" };
  }

  const title = post.seoTitle ?? post.title;
  const description =
    post.seoDesc ?? post.excerpt ?? extractPlainText(post.content, 160);
  const ogImages = post.thumbnail ? [{ url: post.thumbnail }] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const { html } = renderTiptap(post.content as object);
  const readMin = estimateReadingTime(post.content);
  const publishedDate = post.publishedAt ?? post.createdAt;

  // 관련 글 — 같은 카테고리 3건 (본 글 제외)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      category: post.category,
      NOT: { id: post.id },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
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
      {/* Back link */}
      <div className="wp-container pt-10 md:pt-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5f6363] transition-colors hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          블로그 목록으로
        </Link>
      </div>

      {/* ────────────── 1. Header section (6 | 5 split) ────────────── */}
      <header className="wp-container mt-6 md:mt-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left: 텍스트 영역 (span 6) */}
          <div className="flex flex-col lg:col-span-6">
            {/* Category eyebrow — 12px uppercase #5f6363 */}
            <p className="text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              {BLOG_CATEGORY_LABELS[post.category]}
            </p>

            {/* H1 — Maki g_title--l: 56px / 500 / 100% (모바일 2.25rem) */}
            <h1 className="mt-4 text-[2.25rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[3.5rem]">
              {post.title}
            </h1>

            {/* Description — body-l: 20px / 30px / #5f6363 */}
            {post.excerpt && (
              <p className="mt-6 text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px] md:leading-[30px]">
                {post.excerpt}
              </p>
            )}

            {/* Meta row — 날짜 + 읽기 시간 */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              <time
                dateTime={publishedDate.toISOString()}
                className="text-[14px] font-normal leading-[1.5] text-[#5f6363]"
              >
                {formatDateLong(publishedDate)}
              </time>
              <span className="h-3 w-px bg-[var(--color-border)]" aria-hidden />
              <span className="inline-flex items-center gap-1.5 text-[14px] font-normal text-[#5f6363]">
                <Clock className="h-3.5 w-3.5" />
                {readMin} 분 읽기
              </span>
            </div>
          </div>

          {/* Right: Feature image 16:9 (span 5) */}
          <div className="lg:col-span-5 lg:col-start-8">
            {post.thumbnail ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#f8f9fa]">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 521px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              // Placeholder 그라디언트 (썸네일 없을 때)
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[#e0f0ff] via-[#eff4ff] to-[#f0fdf4]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 text-[var(--color-primary)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
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
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ────────────── 2. Body section (7 | 4 split) ────────────── */}
      <div className="wp-container mt-14 md:mt-20 lg:mt-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left: Article body (span 7) */}
          <article
            className="prose-blog lg:col-span-7"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Right: Sticky dark CTA card (span 4) — Maki .c_card_cta is--mode_2 */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-[120px]">
              <div className="overflow-hidden rounded-lg bg-[#282828] p-6 text-white">
                <p className="text-[18px] font-semibold leading-[1.3] text-white md:text-[20px]">
                  코비가 귀사의 채용을 어떻게 바꿀 수 있을까요?
                </p>
                <p className="mt-3 text-[13px] leading-[1.55] text-white/70">
                  1 영업일 내 맞춤 데모 제안 · 무료 체험 30일
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  데모 신청하기
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Tags (있으면 CTA 아래에) */}
              {post.tags.length > 0 && (
                <div className="mt-5 rounded-lg border border-[var(--color-border)] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                    Tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] font-medium text-[#5f6363]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ────────────── 3. Related content ────────────── */}
      {relatedPosts.length > 0 && (
        <div className="wp-container mt-20 pt-16 md:mt-24 md:pt-20">
          <div className="border-t border-[var(--color-border)] pt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-[2rem] font-medium leading-[1.15] text-[#282828] md:text-[2.75rem]">
                Related content
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-primary)] hover:underline"
              >
                모든 글 보기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ul className="mt-10 grid gap-7 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#e3f0e7] bg-white transition-colors hover:border-[var(--color-primary)]/40"
                  >
                    <div className="relative aspect-[16/9] bg-[var(--color-primary-light)]">
                      {p.thumbnail && (
                        <Image
                          src={p.thumbnail}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <span className="text-[12px] font-medium uppercase leading-[1.3] tracking-wide text-[#091010]">
                        {BLOG_CATEGORY_LABELS[p.category]}
                      </span>
                      <h3 className="text-[20px] font-medium leading-[1.3] text-[#282828] group-hover:text-[var(--color-primary)]">
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="line-clamp-2 text-[15px] leading-[1.5] text-[#5f6363]">
                          {p.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ────────────── 4. Footer CTA banner (full-width 다크) ────────────── */}
      <div className="wp-container mt-20 pb-20 md:mt-24 md:pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-[#091010] px-6 py-14 md:px-12 md:py-16 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--color-primary)]/20 blur-3xl"
          />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div>
              <h2 className="text-[1.75rem] font-medium leading-[1.15] text-white md:text-[2.25rem]">
                코비가 어떻게 채용을
                <br className="hidden md:block" /> 바꾸는지 직접 보세요
              </h2>
              <p className="mt-4 text-[14.5px] leading-[1.55] text-white/70 md:text-[16px]">
                귀사의 채용 프로세스에 맞춘 맞춤 데모를 1 영업일 내 제안해드립니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                데모 신청하기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/download"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]"
              >
                소개서 받기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateLong(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
