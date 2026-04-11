import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORY_LABELS } from "@/lib/validations";
import { renderTiptap, estimateReadingTime, extractPlainText } from "@/lib/tiptap";

/**
 * /blog/[slug] — 블로그 상세 페이지 (기획문서 3.2).
 *
 * - SSG + ISR (60s 재검증)
 * - Tiptap JSON → HTML 렌더 (lib/tiptap.ts)
 * - TOC (헤딩 id 주입)
 * - 같은 카테고리 관련 글 3건
 * - 하단 도입 문의 CTA 배너
 * - generateMetadata: OG + 설명 자동 생성
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
    post.seoDesc ??
    post.excerpt ??
    extractPlainText(post.content, 160);
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

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const { html, toc } = renderTiptap(post.content as object);
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
      {/* 상단 back 링크 */}
      <div className="wp-container pt-10 md:pt-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5f6363] transition-colors hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          블로그 목록으로
        </Link>
      </div>

      {/* 제목 영역 */}
      <header className="wp-container mt-6 md:mt-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-[var(--color-primary-light)] px-2.5 py-1 text-[12px] font-semibold text-[var(--color-primary)]">
              {BLOG_CATEGORY_LABELS[post.category]}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] text-[#9ca3af]">
              <Clock className="h-3.5 w-3.5" />
              {readMin} 분 읽기
            </span>
          </div>

          <h1 className="mt-5 text-[2.25rem] font-semibold leading-[1.2] tracking-tight text-[#282828] md:text-[3rem]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-[18px] leading-[1.6] text-[#5f6363] md:text-[19px]">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between border-b border-[var(--color-border)] pb-6">
            <time
              dateTime={publishedDate.toISOString()}
              className="text-[12.5px] text-[#5f6363]"
            >
              {formatDate(publishedDate)}
            </time>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] font-medium text-[#5f6363]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 썸네일 */}
      {post.thumbnail && (
        <div className="wp-container mt-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#f8f9fa]">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* 본문 + TOC 사이드바 */}
      <div className="wp-container mt-12 md:mt-16 lg:mt-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
          {/* Article body */}
          <article
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* TOC sidebar */}
          {toc.length > 0 && (
            <aside className="order-first lg:order-none">
              <div className="sticky top-28 rounded-2xl border border-[var(--color-border)] bg-[#fafbfc] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                  목차
                </p>
                <nav className="mt-3">
                  <ul className="flex flex-col gap-2">
                    {toc.map((h, i) => (
                      <li
                        key={`${h.id}-${i}`}
                        className={h.level === 1 ? "" : h.level === 2 ? "pl-2" : "pl-4"}
                      >
                        <a
                          href={`#${h.id}`}
                          className="block text-[12.5px] leading-[1.45] text-[#5f6363] transition-colors hover:text-[var(--color-primary)]"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* CTA 배너 */}
      <div className="wp-container mt-16 md:mt-20 lg:mt-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A6FFF] via-[#2563eb] to-[#1e3a8a] px-6 py-14 text-white md:px-12 md:py-16">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                Get Started
              </p>
              <h2 className="mt-2 text-[1.75rem] font-medium leading-[1.2] text-white md:text-[2rem]">
                코비와 함께 채용을 혁신하세요
              </h2>
              <p className="mt-2 text-[14.5px] leading-[1.5] text-white/80 md:text-[15px]">
                1 영업일 내 맞춤 데모 제안 · 무료 체험 30일 · 기업 보안 검토 완료
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold leading-[1.5] text-[var(--color-primary)] transition-transform hover:scale-[1.02]"
            >
              데모 신청하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 관련 글 */}
      {relatedPosts.length > 0 && (
        <div className="wp-container mt-20 pb-20 md:mt-24 md:pb-28">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[1.5rem] font-semibold text-[#282828] md:text-[1.75rem]">
                함께 읽기
              </h3>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-primary)] hover:underline"
              >
                모든 글 보기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ul className="mt-6 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-colors hover:border-[var(--color-primary)]/40"
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
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                        {BLOG_CATEGORY_LABELS[p.category]}
                      </span>
                      <h4 className="text-[16px] font-semibold leading-[1.35] text-[#282828] group-hover:text-[var(--color-primary)]">
                        {p.title}
                      </h4>
                      {p.excerpt && (
                        <p className="line-clamp-2 text-[12.5px] leading-[1.5] text-[#5f6363]">
                          {p.excerpt}
                        </p>
                      )}
                      <time className="mt-auto pt-2 text-[11px] text-[#9ca3af]">
                        {formatDate(p.publishedAt ?? p.createdAt)}
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
