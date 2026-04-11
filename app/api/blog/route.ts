import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { blogPostSchema, BLOG_CATEGORIES } from "@/lib/validations";

/**
 * GET /api/blog — 블로그 목록.
 *   - 공개 (unauth): PUBLISHED 만
 *   - 관리자 (auth): DRAFT + PUBLISHED 모두
 * Query: category, q, limit
 */
export async function GET(request: Request) {
  const user = await getAdminUser();
  const isAdmin = !!user;

  const url = new URL(request.url);
  const categoryParam = url.searchParams.get("category");
  const q = url.searchParams.get("q")?.trim();
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit")) || 50),
  );

  const category = (BLOG_CATEGORIES as readonly string[]).includes(
    categoryParam ?? "",
  )
    ? (categoryParam as (typeof BLOG_CATEGORIES)[number])
    : undefined;

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        ...(isAdmin ? {} : { status: "PUBLISHED" }),
        ...(category ? { category } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [
        { status: "asc" }, // DRAFT first for admin? 실제로는 desc pub
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        category: true,
        tags: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        // content 는 목록에선 제외 (무거움)
      },
    });

    return NextResponse.json({ ok: true, count: posts.length, posts });
  } catch (err) {
    console.error("[api/blog] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * POST /api/blog — 관리자 전용, 신규 블로그 글 생성.
 */
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  // AdminUser 레코드 upsert (Supabase auth.users.id == AdminUser.id)
  await prisma.adminUser.upsert({
    where: { id: user.id },
    update: { email: user.email ?? "" },
    create: {
      id: user.id,
      email: user.email ?? "",
      name:
        (user.user_metadata?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "admin",
    },
  });

  try {
    // create + stats increment 원자성.
    // PUBLISHED 로 바로 생성될 수 있으므로 blogPostsPublished 도 조건부 증분.
    const isPublished = data.status === "PUBLISHED";
    const [created] = await prisma.$transaction([
      prisma.blogPost.create({
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
              : isPublished
                ? new Date()
                : null,
          seoTitle: data.seoTitle ?? null,
          seoDesc: data.seoDesc ?? null,
          authorId: user.id,
        },
        select: { id: true, slug: true, createdAt: true },
      }),
      prisma.stats.update({
        where: { id: "singleton" },
        data: {
          blogPostsTotal: { increment: 1 },
          ...(isPublished
            ? { blogPostsPublished: { increment: 1 } }
            : {}),
        },
      }),
    ]);

    return NextResponse.json(
      { ok: true, id: created.id, slug: created.slug, createdAt: created.createdAt },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/blog] POST failed:", err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "이미 존재하는 슬러그입니다" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
