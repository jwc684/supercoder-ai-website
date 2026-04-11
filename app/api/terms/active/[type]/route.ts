import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TERMS_TYPES } from "@/lib/validations";

/**
 * GET /api/terms/active/[type] — 공개 엔드포인트.
 * 해당 type 의 현재 활성(isActive=true) 약관 1건을 반환.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;

  if (!(TERMS_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json(
      { error: "유효하지 않은 type" },
      { status: 400 },
    );
  }

  try {
    const terms = await prisma.terms.findFirst({
      where: {
        type: type as (typeof TERMS_TYPES)[number],
        isActive: true,
      },
      orderBy: { effectiveDate: "desc" },
    });
    if (!terms) {
      return NextResponse.json(
        { error: "활성 약관이 없습니다" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, terms });
  } catch (err) {
    console.error("[api/terms/active/:type] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
