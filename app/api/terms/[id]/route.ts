import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { termsSchema } from "@/lib/validations";

/**
 * GET /api/terms/[id] — 단일 약관 조회 (관리자 전용).
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
    const terms = await prisma.terms.findUnique({ where: { id } });
    if (!terms) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, terms });
  } catch (err) {
    console.error("[api/terms/:id] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * PUT /api/terms/[id] — 약관 업데이트.
 * isActive 는 별도 /activate 엔드포인트에서만 변경.
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

  const parsed = termsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const existing = await prisma.terms.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.terms.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        content: data.content as Prisma.InputJsonValue,
        version: data.version,
        effectiveDate: new Date(data.effectiveDate),
      },
    });

    return NextResponse.json({ ok: true, terms: updated });
  } catch (err) {
    console.error("[api/terms/:id] PUT failed:", err);
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}

/**
 * DELETE /api/terms/[id] — 약관 삭제.
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
    await prisma.terms.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/terms/:id] DELETE failed:", err);
    return NextResponse.json(
      { error: "삭제 실패 (존재하지 않을 수 있음)" },
      { status: 404 },
    );
  }
}
