import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { downloadSchema } from "@/lib/validations";
import { getAdminUser } from "@/lib/auth";
import { sendBrochureEmail } from "@/lib/email/send-brochure";

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
    // insert + stats increment 를 원자적으로
    const [record] = await prisma.$transaction([
      prisma.download.create({
        data: {
          company: data.company,
          name: data.name,
          email: data.email,
          jobTitle: data.jobTitle ?? null,
          phone: data.phone ?? null,
          interests: data.interests ?? [],
          ageOver14: data.ageOver14,
          privacyAgreed: data.privacyAgreed,
          marketingAgreed: data.marketingAgreed ?? false,
        },
        select: { id: true, createdAt: true },
      }),
      prisma.stats.update({
        where: { id: "singleton" },
        data: { downloadsTotal: { increment: 1 } },
      }),
    ]);

    // 최신 브로셔 파일명 (메일 본문 파일명 표기용).
    const latest = await prisma.brochure.findFirst({
      orderBy: { createdAt: "desc" },
      select: { filename: true },
    });
    const filename = latest?.filename ?? "supercoder-brochure.pdf";

    // 이메일 발송 — 실패해도 클라이언트 흐름은 유지하되 발송 상태는 DB 에 기록.
    // 수신자의 실제 다운로드는 이제 이메일 링크(/api/downloads/:id/file) 로만 이뤄진다.
    try {
      await sendBrochureEmail({
        to: data.email,
        name: data.name,
        company: data.company,
        filename,
        downloadId: record.id,
        marketingOptIn: data.marketingAgreed ?? false,
      });
      // 발송 성공 타임스탬프 기록.
      await prisma.download.update({
        where: { id: record.id },
        data: { emailSentAt: new Date() },
      });
    } catch (mailErr) {
      // 메일 실패만으로 500 을 내리지 않지만, admin 에서 원인 확인하도록 에러 메시지 저장.
      const msg =
        mailErr instanceof Error ? mailErr.message : String(mailErr);
      console.error("[api/downloads] brochure email failed:", mailErr);
      await prisma.download
        .update({
          where: { id: record.id },
          data: { emailSendError: msg.slice(0, 500) },
        })
        .catch((dbErr) =>
          console.error(
            "[api/downloads] failed to record email error:",
            dbErr,
          ),
        );
    }

    return NextResponse.json(
      {
        ok: true,
        id: record.id,
        createdAt: record.createdAt,
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
