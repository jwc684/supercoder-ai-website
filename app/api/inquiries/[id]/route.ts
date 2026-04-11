import { NextResponse } from "next/server";
import { z } from "zod";
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
    const updated = await prisma.inquiry.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, inquiry: updated });
  } catch (err) {
    console.error("[api/inquiries/:id PATCH] failed:", err);
    return NextResponse.json(
      { error: "업데이트 실패. 존재하지 않는 ID 일 수 있습니다." },
      { status: 404 },
    );
  }
}
