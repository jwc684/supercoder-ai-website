import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquirySchema } from "@/lib/validations";

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
    const record = await prisma.inquiry.create({
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
    });

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
