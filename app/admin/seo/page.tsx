import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { STATIC_FALLBACKS } from "@/lib/seo";
import { SeoEditorClient } from "./SeoEditorClient";

/**
 * /admin/seo — 페이지 SEO 통합 관리.
 *
 * 좌측: 정적 9개 + 블로그 글 전체 리스트 (Webflow Page Settings 스타일)
 * 우측: 선택된 페이지의 편집 폼 (제목, 설명, Social Preview 이미지, 색인 토글, SERP 미리보기)
 *
 * 저장 시 경로에 따라:
 *   - 정적 → PageMeta upsert → revalidatePath
 *   - 블로그 → BlogPost.seoTitle/seoDesc/thumbnail 업데이트 → revalidatePath
 */
export default async function AdminSeoPage() {
  await requireAdmin();

  const [pageMetas, blogPosts] = await Promise.all([
    prisma.pageMeta.findMany(),
    prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        seoTitle: true,
        seoDesc: true,
        thumbnail: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const metaByPath = new Map(pageMetas.map((m) => [m.path, m]));

  const staticPages = Object.entries(STATIC_FALLBACKS).map(([path, fb]) => {
    const meta = metaByPath.get(path);
    return {
      path,
      title: meta?.title ?? fb.title,
      description: meta?.description ?? fb.description,
      socialImage: meta?.socialImage ?? null,
      socialImagePath: meta?.socialImagePath ?? null,
      indexable: meta?.indexable ?? true,
    };
  });

  const blogPages = blogPosts.map((p) => ({
    id: p.id,
    path: `/blog/${p.slug}`,
    title: p.title,
    slug: p.slug,
    seoTitle: p.seoTitle,
    seoDesc: p.seoDesc,
    thumbnail: p.thumbnail,
    status: p.status,
  }));

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          SEO
        </p>
        <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
          페이지 SEO 관리
        </h1>
        <p className="mt-1 text-[14px] text-[#5f6363]">
          각 페이지의 제목 · 설명 · Social Preview 이미지를 편집합니다.
          저장 시 해당 페이지의 메타 태그와 OG 태그가 즉시 반영됩니다.
        </p>
      </div>

      <div className="mt-8">
        <SeoEditorClient
          staticPages={staticPages}
          blogPages={blogPages}
        />
      </div>
    </div>
  );
}
