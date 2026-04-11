import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { BlogEditorForm } from "../BlogEditorForm";
import type { RichEditorContent } from "@/components/admin/RichEditor";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  // datetime-local input 은 로컬 타임존 기반 "YYYY-MM-DDTHH:mm" 형식을 기대
  const toLocalInput = (d: Date | null): string => {
    if (!d) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-[#5f6363] transition-colors hover:bg-[#f0f1f3] hover:text-[#282828]"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>
      </div>
      <div className="mt-3">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Edit Post
        </p>
        <h1 className="text-[24px] font-medium leading-[1.2] text-[#282828] md:text-[28px]">
          블로그 글 편집
        </h1>
      </div>

      <div className="mt-6">
        <BlogEditorForm
          mode="edit"
          postId={post.id}
          initial={{
            title: post.title,
            slug: post.slug,
            content: post.content as RichEditorContent,
            excerpt: post.excerpt ?? "",
            thumbnail: post.thumbnail ?? "",
            category: post.category,
            tags: post.tags,
            status: post.status,
            publishedAt: toLocalInput(post.publishedAt),
            seoTitle: post.seoTitle ?? "",
            seoDesc: post.seoDesc ?? "",
          }}
        />
      </div>
    </div>
  );
}
