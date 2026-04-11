import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { downloadSchema } from "@/lib/validations";
import { getAdminUser } from "@/lib/auth";

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

    // 현재 활성 브로셔(최신 업로드) URL 을 반환. 없으면 정적 placeholder.
    const latest = await prisma.brochure.findFirst({
      orderBy: { createdAt: "desc" },
      select: { url: true, filename: true },
    });
    const downloadUrl = latest?.url ?? "/files/supercoder-brochure.pdf";

    return NextResponse.json(
      {
        ok: true,
        id: record.id,
        createdAt: record.createdAt,
        downloadUrl,
        filename: latest?.filename ?? "supercoder-brochure.pdf",
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

/**
 * GET /api/downloads — 관리자 리스트 조회.
 * Query params:
 *   - q: 검색어 (company / name / email contains, 선택)
 *   - limit: 기본 100, 최대 500
 */
export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(500, Math.max(1, Number(limitParam) || 100));

  try {
    const downloads = await prisma.download.findMany({
      where: q
        ? {
            OR: [
              { company: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ ok: true, count: downloads.length, downloads });
  } catch (err) {
    console.error("[api/downloads] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
