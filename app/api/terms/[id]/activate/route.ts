import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

/**
 * PATCH /api/terms/[id]/activate — 약관 활성화 (토글).
 *
 * body: { active: boolean }
 *
 * active=true 시:
 *   - 트랜잭션으로 동일 type 의 모든 약관을 비활성화
 *   - 해당 id 만 활성화
 *
 * active=false 시:
 *   - 해당 id 만 비활성화
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { active?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.active !== "boolean") {
    return NextResponse.json(
      { error: "body.active (boolean) 필드가 필요합니다" },
      { status: 400 },
    );
  }
  const active = body.active;

  try {
    const existing = await prisma.terms.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (active) {
        // 1. 동일 type 의 모든 약관을 먼저 비활성화
        await tx.terms.updateMany({
          where: { type: existing.type, isActive: true, NOT: { id } },
          data: { isActive: false },
        });
      }
      // 2. 대상 약관의 상태 설정
      return tx.terms.update({
        where: { id },
        data: { isActive: active },
      });
    });

    return NextResponse.json({ ok: true, terms: updated });
  } catch (err) {
    console.error("[api/terms/:id/activate] PATCH failed:", err);
    return NextResponse.json(
      { error: "활성화 토글 실패" },
      { status: 500 },
    );
  }
}
