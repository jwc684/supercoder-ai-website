import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/downloads/[id]/file
 *
 * 이메일 본문의 "소개서 확인하기" 버튼이 가리키는 URL.
 * - Download.emailClickCount 를 +1 하고 emailFirstClickedAt 가 null 이면 세팅
 * - 최신 활성 브로셔의 Supabase URL 로 302 리다이렉트
 * - 인증 없음 (이메일 내 링크라 수신자가 직접 접근)
 *
 * 레코드/브로셔 누락 시에도 UX 가 깨지지 않게 홈으로 리다이렉트한다.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const download = await prisma.download.findUnique({
    where: { id },
    select: { id: true, emailFirstClickedAt: true },
  });

  if (!download) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  // 최신 브로셔 URL 조회. 없으면 홈으로 (이 경우는 운영 시 발생하면 안 됨).
  const latest = await prisma.brochure.findFirst({
    orderBy: { createdAt: "desc" },
    select: { url: true },
  });
  if (!latest?.url) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  // 클릭 카운트 업데이트 — emailFirstClickedAt 은 최초 1회만.
  await prisma.download.update({
    where: { id },
    data: {
      emailClickCount: { increment: 1 },
      ...(download.emailFirstClickedAt == null && {
        emailFirstClickedAt: new Date(),
      }),
    },
  });

  // Supabase public URL 로 리다이렉트 (그 쪽이 Content-Disposition 도 처리).
  return NextResponse.redirect(latest.url, 302);
}
