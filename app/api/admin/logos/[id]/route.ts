import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * PATCH /api/admin/logos/[id] — name · sortOrder · isVisible 업데이트.
 * DELETE /api/admin/logos/[id] — DB row 삭제 + Storage 파일 삭제.
 */

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  sortOrder: z.number().int().optional(),
  isVisible: z.boolean().optional(),
});

const BUCKET = "seo-images";

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
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON 이 아닙니다" },
      { status: 400 },
    );
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.logo.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, logo: updated });
  } catch (err) {
    console.error("[api/admin/logos/:id] PATCH failed:", err);
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}

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
    const row = await prisma.logo.findUnique({
      where: { id },
      select: { id: true, storagePath: true },
    });
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Storage 파일 먼저 삭제 (실패해도 DB row 는 제거)
    try {
      const supabase = createAdminClient();
      const { error: rmErr } = await supabase.storage
        .from(BUCKET)
        .remove([row.storagePath]);
      if (rmErr) {
        console.warn(
          `[api/admin/logos/${id}] storage remove failed:`,
          rmErr.message,
        );
      }
    } catch (e) {
      console.warn(`[api/admin/logos/${id}] storage client error:`, e);
    }

    await prisma.logo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/logos/:id] DELETE failed:", err);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
