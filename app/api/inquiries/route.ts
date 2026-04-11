import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations";
import { getAdminUser } from "@/lib/auth";
import type { InquiryStatus } from "@prisma/client";

/**
 * POST /api/inquiries — 공개 도입 문의 생성.
 * 본문은 inquirySchema 로 검증 후 Prisma 로 DB 삽입.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON 이 아닙니다" },
      { status: 400 },
    );
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "유효하지 않은 입력",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    // insert + stats increment 를 단일 트랜잭션으로 묶어 원자성 보장
    const [record] = await prisma.$transaction([
      prisma.inquiry.create({
        data: {
          company: data.company,
          name: data.name,
          email: data.email,
          phone: data.phone,
          jobTitle: data.jobTitle ?? null,
          hireSize: data.hireSize ?? null,
          interests: data.interests ?? [],
          message: data.message ?? null,
          privacyAgreed: data.privacyAgreed,
        },
        select: { id: true, createdAt: true },
      }),
      prisma.stats.update({
        where: { id: "singleton" },
        data: {
          inquiriesTotal: { increment: 1 },
          inquiriesNew: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json(
      { ok: true, id: record.id, createdAt: record.createdAt },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/inquiries] DB insert failed:", err);
    return NextResponse.json(
      { error: "서버 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}

/**
 * GET /api/inquiries — 관리자 리스트 조회.
 * Query params:
 *   - status: NEW | REVIEWED | CONTACTED | COMPLETED (필터, 선택)
 *   - q: 검색어 (company / name / email 에 대해 contains, 선택)
 *   - limit: 기본 100, 최대 500
 */
export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status");
  const q = url.searchParams.get("q")?.trim();
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(500, Math.max(1, Number(limitParam) || 100));

  const statusValues: InquiryStatus[] = [
    "NEW",
    "REVIEWED",
    "CONTACTED",
    "COMPLETED",
  ];
  const status = statusValues.includes(statusParam as InquiryStatus)
    ? (statusParam as InquiryStatus)
    : undefined;

  try {
    const inquiries = await prisma.inquiry.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { company: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ ok: true, count: inquiries.length, inquiries });
  } catch (err) {
    console.error("[api/inquiries] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
