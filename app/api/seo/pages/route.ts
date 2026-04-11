import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { STATIC_FALLBACKS } from "@/lib/seo";

/**
 * GET /api/seo/pages — 관리자 전용, SEO 편집 가능한 페이지 통합 목록.
 *
 * 정적 페이지: STATIC_FALLBACKS 의 키 전부 + PageMeta 조회해서 병합
 * 블로그 글: BlogPost 전부 (seoTitle / seoDesc / thumbnail 포함)
 *
 * 응답 형태:
 * {
 *   static: [{ path, title, description, socialImage, indexable, hasMeta }],
 *   blog:   [{ id, path, title, slug, seoTitle, seoDesc, thumbnail, status }]
 * }
 */
export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
        hasMeta: !!meta,
      };
    });

    const blog = blogPosts.map((p) => ({
      id: p.id,
      path: `/blog/${p.slug}`,
      title: p.title,
      slug: p.slug,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDesc,
      thumbnail: p.thumbnail,
      status: p.status,
    }));

    return NextResponse.json({ ok: true, static: staticPages, blog });
  } catch (err) {
    console.error("[api/seo/pages] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
