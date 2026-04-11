import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { STATIC_FALLBACKS } from "@/lib/seo";

/**
 * GET /api/seo/pages/[encodedPath] — 단일 페이지 SEO 조회
 * PUT /api/seo/pages/[encodedPath] — 업데이트
 *
 * path 는 URL-encoded ("%2F" 포함). 예: /api/seo/pages/%2Fcontact
 *
 * 동작 분기:
 *   - 정적 경로 (STATIC_FALLBACKS 에 있는 경로): PageMeta upsert
 *   - /blog/{slug}: BlogPost.seoTitle/seoDesc/thumbnail 업데이트
 *   - 그 외: 404
 */

const pageMetaSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해주세요").max(200),
  description: z.string().trim().min(1, "설명을 입력해주세요").max(500),
  // 이미지가 없을 땐 null, 있을 땐 Supabase Storage public URL
  socialImage: z.string().url().nullable().optional(),
  socialImagePath: z.string().nullable().optional(),
  indexable: z.boolean().optional(),
});

function decodePath(encoded: string): string {
  try {
    const decoded = decodeURIComponent(encoded);
    return decoded.startsWith("/") ? decoded : `/${decoded}`;
  } catch {
    return `/${encoded}`;
  }
}

function isStaticPath(path: string): boolean {
  return path in STATIC_FALLBACKS;
}

function isBlogPath(path: string): boolean {
  return path.startsWith("/blog/") && path.length > "/blog/".length;
}

function slugFromBlogPath(path: string): string {
  return path.replace(/^\/blog\//, "").replace(/\/$/, "");
}

/**
 * GET — 단일 페이지 조회
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ encodedPath: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { encodedPath } = await params;
  const path = decodePath(encodedPath);

  try {
    if (isStaticPath(path)) {
      const row = await prisma.pageMeta.findUnique({ where: { path } });
      const fb = STATIC_FALLBACKS[path];
      return NextResponse.json({
        ok: true,
        kind: "static",
        page: {
          path,
          title: row?.title ?? fb.title,
          description: row?.description ?? fb.description,
          socialImage: row?.socialImage ?? null,
          socialImagePath: row?.socialImagePath ?? null,
          indexable: row?.indexable ?? true,
        },
      });
    }

    if (isBlogPath(path)) {
      const slug = slugFromBlogPath(path);
      const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          seoTitle: true,
          seoDesc: true,
          thumbnail: true,
          status: true,
        },
      });
      if (!post) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({
        ok: true,
        kind: "blog",
        page: {
          id: post.id,
          path,
          title: post.seoTitle ?? post.title,
          description: post.seoDesc ?? "",
          socialImage: post.thumbnail ?? null,
          slug: post.slug,
          status: post.status,
        },
      });
    }

    return NextResponse.json({ error: "Unknown path" }, { status: 404 });
  } catch (err) {
    console.error("[api/seo/pages/:encodedPath] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * PUT — 단일 페이지 업데이트 (정적 → PageMeta, 블로그 → BlogPost)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ encodedPath: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { encodedPath } = await params;
  const path = decodePath(encodedPath);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = pageMetaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    if (isStaticPath(path)) {
      // PageMeta upsert
      const saved = await prisma.pageMeta.upsert({
        where: { path },
        update: {
          title: data.title,
          description: data.description,
          socialImage: data.socialImage ?? null,
          socialImagePath: data.socialImagePath ?? null,
          ...(data.indexable !== undefined
            ? { indexable: data.indexable }
            : {}),
        },
        create: {
          path,
          title: data.title,
          description: data.description,
          socialImage: data.socialImage ?? null,
          socialImagePath: data.socialImagePath ?? null,
          indexable: data.indexable ?? true,
        },
      });
      // 해당 경로 캐시 무효화 (ISR)
      revalidatePath(path);
      return NextResponse.json({ ok: true, kind: "static", page: saved });
    }

    if (isBlogPath(path)) {
      const slug = slugFromBlogPath(path);
      const updated = await prisma.blogPost.update({
        where: { slug },
        data: {
          seoTitle: data.title,
          seoDesc: data.description,
          ...(data.socialImage !== undefined
            ? { thumbnail: data.socialImage ?? null }
            : {}),
        },
      });
      revalidatePath(path);
      return NextResponse.json({ ok: true, kind: "blog", page: updated });
    }

    return NextResponse.json({ error: "Unknown path" }, { status: 404 });
  } catch (err) {
    console.error("[api/seo/pages/:encodedPath] PUT failed:", err);
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}
