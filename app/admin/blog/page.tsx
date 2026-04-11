import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { BLOG_CATEGORY_LABELS } from "@/lib/validations";
import { BlogListToolbar } from "./BlogListToolbar";

/**
 * /admin/blog — 블로그 글 목록 (기획문서 4.3).
 *
 * 목록 조회는 서버 컴포넌트에서 Prisma 직접 호출.
 * 필터/검색 UI 는 URL 쿼리 파라미터 기반 — BlogListToolbar 가 navigation.
 */
export default async function AdminBlogListPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    category?: string;
    q?: string;
  }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const status =
    params.status === "DRAFT" || params.status === "PUBLISHED"
      ? params.status
      : undefined;
  const category = params.category && params.category !== "ALL"
    ? params.category
    : undefined;
  const q = params.q?.trim() || undefined;

  const posts = await prisma.blogPost.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(category
        ? { category: category as "AI_HIRING" | "INSIGHT" | "CASE_STUDY" | "PRODUCT_UPDATE" }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }],
    take: 200,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Blog
          </p>
          <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
            블로그 글 관리
          </h1>
          <p className="mt-1 text-[14px] text-[#5f6363]">
            총 {posts.length}건 조회. 새 글을 작성하거나 기존 글을 편집하세요.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="h-4 w-4" />새 글 작성
        </Link>
      </div>

      {/* Toolbar */}
      <div className="mt-6">
        <BlogListToolbar
          initialStatus={status ?? "ALL"}
          initialCategory={category ?? "ALL"}
          initialQuery={q ?? ""}
        />
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-[#fafbfc]">
            <tr className="border-b border-[var(--color-border)] text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
              <th className="px-4 py-3">제목</th>
              <th className="px-4 py-3">카테고리</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">발행일</th>
              <th className="px-4 py-3 text-right">액션</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[13px] text-[#5f6363]"
                >
                  글이 없습니다. 상단 "새 글 작성" 버튼으로 시작하세요.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-[var(--color-border)] last:border-0 transition-colors hover:bg-[#f8f9fa]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="text-[13px] font-medium text-[#282828] hover:text-[var(--color-primary)]"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-[#9ca3af]">
                    /{post.slug}
                  </p>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5f6363]">
                  {BLOG_CATEGORY_LABELS[post.category]}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={post.status} />
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5f6363]">
                  {post.publishedAt
                    ? formatDate(post.publishedAt)
                    : post.status === "DRAFT"
                      ? "초안"
                      : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {post.status === "PUBLISHED" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        title="공개 페이지 보기"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] hover:bg-[#f0f1f3] hover:text-[#282828]"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}`}
                      title="편집"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] hover:bg-[#f0f1f3] hover:text-[var(--color-primary)]"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  if (status === "PUBLISHED") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-semibold text-[#16a34a] ring-1 ring-inset ring-[#bbf7d0]">
        발행
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#fffbeb] px-2.5 py-1 text-[11px] font-semibold text-[#b45309] ring-1 ring-inset ring-[#fde68a]">
      초안
    </span>
  );
}

function formatDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
