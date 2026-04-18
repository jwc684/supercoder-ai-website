import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BLOG_CATEGORY_LABELS } from "@/lib/validations";
import {
  renderTiptap,
  estimateReadingTime,
  extractPlainText,
} from "@/lib/tiptap";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogFooterCta } from "@/components/landing/BlogFooterCta";

/**
 * /blog/[slug] — 블로그 상세 페이지 (Maki /blog/:slug 구조 매칭).
 *
 * 레이아웃:
 *   1. Header section (6|5 split): text + feature image 16:9
 *   2. Body section (7|4 split): article + sticky sidebar (TOC + CTA)
 *   3. Related content section: divider + H2 + 3 cards
 *   4. Footer CTA section: divider + centered heading + buttons + 4 stat cards
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

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, email: true } },
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const { html, toc } = renderTiptap(post.content as object);
  const readMin = estimateReadingTime(post.content);
  const publishedDate = post.publishedAt ?? post.createdAt;
  // 이메일 로컬 파트가 공개 메타/JSON-LD 에 노출되지 않도록 name 만 사용, fallback 은 브랜드명.
  const authorName = post.author?.name ?? "Supercoder";

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

  // JSON-LD 구조화 데이터 (Article + BreadcrumbList)
  const articleSchema = articleJsonLd({
    title: post.seoTitle ?? post.title,
    description:
      post.seoDesc ?? post.excerpt ?? extractPlainText(post.content, 160),
    slug: post.slug,
    thumbnail: post.thumbnail,
    author: authorName,
    publishedAt: publishedDate,
    updatedAt: post.updatedAt,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "홈", url: "/" },
    { name: "블로그", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <div className="bg-white">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
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
          {/* Left: 텍스트 영역 (span 6) — Maki g_flex--dvlc_tvct */}
          <div className="flex flex-col lg:col-span-6">
            {/* Category eyebrow (g_label) — 12px uppercase */}
            <p className="text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              {BLOG_CATEGORY_LABELS[post.category]}
            </p>

            {/* H1 — Maki g_title--l: 56px / 500 / 100% */}
            <h1 className="mt-4 text-[2.25rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[3.5rem]">
              {post.title}
            </h1>

            {/* Subtitle (g_body--l_400) — 20px / 400 / #282828 */}
            {post.excerpt && (
              <p className="mt-6 text-[18px] font-normal leading-[1.5] text-[#282828] md:text-[20px] md:leading-[30px]">
                {post.excerpt}
              </p>
            )}

            {/* Meta info — Maki .c_template_resource--card_infos 3개 */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <MetaItem icon={Calendar} text={formatDateLong(publishedDate)} />
              <MetaItem icon={Clock} text={`${readMin} 분 읽기`} />
              <MetaItem icon={User} text={authorName} />
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

          {/* Right: Sticky sidebar — TOC + CTA (span 4) */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="flex flex-col gap-5 lg:sticky lg:top-[120px]">
              {/* TOC card (Maki .c_template_resource--toc) */}
              {toc.length > 0 && (
                <nav
                  aria-label="목차"
                  className="rounded-lg border border-[var(--color-border)] bg-white p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                    On this page
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {toc.map((h, i) => (
                      <li
                        key={`${h.id}-${i}`}
                        className={
                          h.level === 1
                            ? ""
                            : h.level === 2
                              ? "pl-3"
                              : "pl-6"
                        }
                      >
                        <a
                          href={`#${h.id}`}
                          className="block text-[12.5px] leading-[1.5] text-[#5f6363] transition-colors hover:text-[var(--color-primary)]"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Dark CTA card — Maki .c_card_cta.is--mode_2 */}
              <div className="overflow-hidden rounded-lg bg-[#282828] p-6 text-white">
                <p className="text-[18px] font-semibold leading-[1.3] text-white md:text-[20px]">
                  AI 면접이 채용을 어떻게 바꿀 수 있을까요?
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

              {/* Tags card (있을 때) */}
              {post.tags.length > 0 && (
                <div className="rounded-lg border border-[var(--color-border)] bg-white p-5">
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

      {/* ────────────── 3. Related content section ────────────── */}
      {relatedPosts.length > 0 && (
        <div className="wp-container mt-20 md:mt-24">
          <div className="border-t border-[var(--color-border)] pt-16 md:pt-20">
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
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-medium text-[var(--color-primary)]">
                        Read More
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ────────────── 4. Footer CTA (공용) ────────────── */}
      <BlogFooterCta />
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────
function MetaItem({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px] font-normal leading-[1.5] text-[#5f6363]">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {text}
    </span>
  );
}

function formatDateLong(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
