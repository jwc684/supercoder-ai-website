import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

/**
 * POST /api/admin/logos/reorder
 * Body: { orderedIds: string[] } — 배열 인덱스 순서가 sortOrder 가 된다 (1-based).
 * 하나의 트랜잭션으로 각 row 의 sortOrder 를 일괄 업데이트.
 */

const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1).max(200),
});

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON 이 아닙니다" },
      { status: 400 },
    );
  }
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "orderedIds 가 필요합니다" },
      { status: 400 },
    );
  }

  try {
    await prisma.$transaction(
      parsed.data.orderedIds.map((id, idx) =>
        prisma.logo.update({
          where: { id },
          data: { sortOrder: idx + 1 },
        }),
      ),
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/logos/reorder] failed:", err);
    return NextResponse.json({ error: "재정렬 실패" }, { status: 500 });
  }
}
