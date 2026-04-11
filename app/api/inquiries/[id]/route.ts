import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

/**
 * PATCH /api/inquiries/[id] — 관리자 전용.
 * 문의의 status 또는 adminNote 를 업데이트.
 */

const patchSchema = z
  .object({
    status: z.enum(["NEW", "REVIEWED", "CONTACTED", "COMPLETED"]).optional(),
    adminNote: z.string().max(4000).nullable().optional(),
  })
  .refine((v) => v.status !== undefined || v.adminNote !== undefined, {
    message: "업데이트할 필드가 없습니다",
  });

export async function PATCH(
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

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    // status 전환 시 Stats.inquiriesNew 카운터 동기화 필요.
    // 이전 상태 확인 → update → 전환 패턴 감지 → counter 조정.
    const existing = await prisma.inquiry.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const prevStatus = existing.status;
    const nextStatus = parsed.data.status ?? prevStatus;
    const inquiriesNewDelta =
      prevStatus === "NEW" && nextStatus !== "NEW"
        ? -1
        : prevStatus !== "NEW" && nextStatus === "NEW"
          ? 1
          : 0;

    const operations: Prisma.PrismaPromise<unknown>[] = [
      prisma.inquiry.update({
        where: { id },
        data: parsed.data,
      }),
    ];
    if (inquiriesNewDelta !== 0) {
      operations.push(
        prisma.stats.update({
          where: { id: "singleton" },
          data: { inquiriesNew: { increment: inquiriesNewDelta } },
        }),
      );
    }
    const results = await prisma.$transaction(operations);
    const updated = results[0] as Awaited<ReturnType<typeof prisma.inquiry.update>>;

    return NextResponse.json({ ok: true, inquiry: updated });
  } catch (err) {
    console.error("[api/inquiries/:id PATCH] failed:", err);
    return NextResponse.json(
      { error: "업데이트 실패. 존재하지 않는 ID 일 수 있습니다." },
      { status: 404 },
    );
  }
}
