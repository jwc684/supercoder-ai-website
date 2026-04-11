import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { downloadSchema } from "@/lib/validations";

/**
 * POST /api/downloads — 공개 소개서 다운로드 리드 등록.
 * 본문은 downloadSchema 로 검증 후 Prisma 삽입.
 * 응답에 downloadUrl 포함해 즉시 다운로드 링크 제공.
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

  const parsed = downloadSchema.safeParse(body);
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
    const record = await prisma.download.create({
      data: {
        company: data.company,
        name: data.name,
        email: data.email,
        jobTitle: data.jobTitle ?? null,
        phone: data.phone ?? null,
        interests: data.interests ?? [],
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json(
      {
        ok: true,
        id: record.id,
        createdAt: record.createdAt,
        downloadUrl: "/files/supercoder-brochure.pdf",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/downloads] DB insert failed:", err);
    return NextResponse.json(
      { error: "서버 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
