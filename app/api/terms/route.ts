import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { termsSchema, TERMS_TYPES } from "@/lib/validations";

/**
 * GET /api/terms — 관리자 전용 약관 목록.
 * Query: type, limit
 */
export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type");
  const limit = Math.min(
    200,
    Math.max(1, Number(url.searchParams.get("limit")) || 200),
  );

  const type = (TERMS_TYPES as readonly string[]).includes(typeParam ?? "")
    ? (typeParam as (typeof TERMS_TYPES)[number])
    : undefined;

  try {
    const terms = await prisma.terms.findMany({
      where: type ? { type } : undefined,
      orderBy: [{ type: "asc" }, { effectiveDate: "desc" }],
      take: limit,
    });
    return NextResponse.json({ ok: true, count: terms.length, terms });
  } catch (err) {
    console.error("[api/terms] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * POST /api/terms — 관리자 전용, 신규 약관 생성. 비활성 상태로 생성.
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

  const parsed = termsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "유효하지 않은 입력", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const created = await prisma.terms.create({
      data: {
        title: data.title,
        type: data.type,
        content: data.content as Prisma.InputJsonValue,
        version: data.version,
        effectiveDate: new Date(data.effectiveDate),
        isActive: false,
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json(
      { ok: true, id: created.id, createdAt: created.createdAt },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/terms] POST failed:", err);
    return NextResponse.json({ error: "생성 실패" }, { status: 500 });
  }
}
