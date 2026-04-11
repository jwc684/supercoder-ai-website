import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";

/**
 * GET /api/blog/[id] — 단일 블로그 글 (content 포함).
 *   - 공개: PUBLISHED 만
 *   - 관리자: 모두
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getAdminUser();
  const isAdmin = !!user;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!isAdmin && post.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error("[api/blog/:id] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * PUT /api/blog/[id] — 관리자 전용, 블로그 글 전체 업데이트.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // status 전환 감지 → Stats.blogPostsPublished 조건부 증분
    const wasPublished = existing.status === "PUBLISHED";
    const willPublish = data.status === "PUBLISHED";
    const publishedDelta = !wasPublished && willPublish
      ? 1
      : wasPublished && !willPublish
        ? -1
        : 0;

    const operations: Prisma.PrismaPromise<unknown>[] = [
      prisma.blogPost.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content as Prisma.InputJsonValue,
          excerpt: data.excerpt ?? null,
          thumbnail: data.thumbnail ?? null,
          category: data.category,
          tags: data.tags ?? [],
          status: data.status,
          publishedAt:
            data.publishedAt && data.publishedAt !== ""
              ? new Date(data.publishedAt)
              : willPublish
                ? (existing.publishedAt ?? new Date())
                : null,
          seoTitle: data.seoTitle ?? null,
          seoDesc: data.seoDesc ?? null,
        },
      }),
    ];
    if (publishedDelta !== 0) {
      operations.push(
        prisma.stats.update({
          where: { id: "singleton" },
          data: { blogPostsPublished: { increment: publishedDelta } },
        }),
      );
    }
    const results = await prisma.$transaction(operations);
    const updated = results[0] as Awaited<ReturnType<typeof prisma.blogPost.update>>;

    return NextResponse.json({ ok: true, post: updated });
  } catch (err) {
    console.error("[api/blog/:id] PUT failed:", err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "이미 존재하는 슬러그입니다" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}

/**
 * DELETE /api/blog/[id] — 관리자 전용, 삭제.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    // 삭제 전 상태 확인 (PUBLISHED 여부 → Stats 감소량 결정)
    const existing = await prisma.blogPost.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const wasPublished = existing.status === "PUBLISHED";
    await prisma.$transaction([
      prisma.blogPost.delete({ where: { id } }),
      prisma.stats.update({
        where: { id: "singleton" },
        data: {
          blogPostsTotal: { increment: -1 },
          ...(wasPublished
            ? { blogPostsPublished: { increment: -1 } }
            : {}),
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/blog/:id] DELETE failed:", err);
    return NextResponse.json({ error: "삭제 실패 (존재하지 않을 수 있음)" }, { status: 404 });
  }
}
