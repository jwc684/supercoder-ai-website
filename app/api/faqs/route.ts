import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { faqSchema } from "@/lib/validations";

/**
 * GET /api/faqs — FAQ 목록.
 * Query: published=1 → 공개용 (인증 불필요, isPublished=true 만)
 *         그 외 → 관리자용 (전체)
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const publishedOnly = url.searchParams.get("published") === "1";

  if (!publishedOnly) {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const faqs = await prisma.faq.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ ok: true, count: faqs.length, faqs });
  } catch (err) {
    console.error("[api/faqs] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * POST /api/faqs — 관리자 전용, 신규 FAQ 생성.
 * order 미지정 시 현재 max(order)+1 로 자동 부여.
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

  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    let order = data.order;
    if (order === undefined) {
      const last = await prisma.faq.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      order = (last?.order ?? -1) + 1;
    }

    const created = await prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer as Prisma.InputJsonValue,
        order,
        isPublished: data.isPublished ?? false,
      },
      select: { id: true, createdAt: true, isPublished: true },
    });

    // 공개 상태로 생성했다면 랜딩 ISR 캐시 무효화.
    if (created.isPublished) revalidatePath("/");

    return NextResponse.json(
      { ok: true, id: created.id, createdAt: created.createdAt },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/faqs] POST failed:", err);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
