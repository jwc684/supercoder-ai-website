import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "brochures";

/**
 * DELETE /api/brochure/[id] — 관리자 전용, 브로셔 삭제.
 * Supabase Storage 객체와 DB 레코드 모두 제거.
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
    const brochure = await prisma.brochure.findUnique({ where: { id } });
    if (!brochure) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Storage 객체 삭제 — 실패해도 DB 레코드는 제거 (고아 데이터 방지)
    const supabase = createAdminClient();
    const { error: removeError } = await supabase.storage
      .from(BUCKET)
      .remove([brochure.path]);
    if (removeError) {
      console.error("[api/brochure/:id] storage remove failed:", removeError);
    }

    await prisma.brochure.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/brochure/:id] DELETE failed:", err);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
