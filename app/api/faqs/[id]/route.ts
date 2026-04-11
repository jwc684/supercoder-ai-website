import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { faqSchema } from "@/lib/validations";

/**
 * GET /api/faqs/[id] — 단일 FAQ 조회 (관리자 전용).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const faq = await prisma.faq.findUnique({ where: { id } });
    if (!faq) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, faq });
  } catch (err) {
    console.error("[api/faqs/:id] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * PUT /api/faqs/[id] — FAQ 업데이트 (question/answer/order/isPublished).
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

  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer as Prisma.InputJsonValue,
        ...(data.order !== undefined ? { order: data.order } : {}),
        ...(data.isPublished !== undefined
          ? { isPublished: data.isPublished }
          : {}),
      },
    });

    // 공개 상태 또는 공개 FAQ 내용이 바뀌었으면 랜딩 캐시 무효화.
    if (existing.isPublished || updated.isPublished) revalidatePath("/");

    return NextResponse.json({ ok: true, faq: updated });
  } catch (err) {
    console.error("[api/faqs/:id] PUT failed:", err);
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}

/**
 * DELETE /api/faqs/[id] — FAQ 삭제.
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
    const deleted = await prisma.faq.delete({ where: { id } });
    if (deleted.isPublished) revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/faqs/:id] DELETE failed:", err);
    return NextResponse.json(
      { error: "삭제 실패 (존재하지 않을 수 있음)" },
      { status: 404 },
    );
  }
}
