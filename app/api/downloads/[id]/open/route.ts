import { prisma } from "@/lib/prisma";

/**
 * GET /api/downloads/[id]/open
 *
 * 이메일 본문 말미에 삽입된 1×1 트래킹 픽셀. 수신자가 메일을 열면
 * 메일 클라이언트가 이 이미지를 로드한다.
 * - Download.emailOpenCount 를 +1 하고 emailFirstOpenedAt 가 null 이면 세팅
 * - 응답은 43 byte 투명 PNG (RFC 2083 minimum 1×1 transparent)
 * - 인증 없음, no-cache (프록시가 캐시 유지하면 추가 오픈이 잡히지 않음)
 *
 * 주의: Gmail 은 이미지 프록시를 사용해 발신 측 IP 를 가린다. IP·UA 수집은
 * 부정확하므로 이 엔드포인트에서는 카운터만 기록한다.
 */

// 43-byte 1×1 transparent PNG (대부분의 메일 클라이언트가 안전하게 처리).
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // 레코드가 존재하는 경우에만 카운트 업데이트. 존재 확인 후 update 하나의 원자적
  // operation 으로도 가능하지만, 없는 id 로 들어오면 조용히 픽셀만 반환.
  const exists = await prisma.download.findUnique({
    where: { id },
    select: { id: true, emailFirstOpenedAt: true },
  });

  if (exists) {
    await prisma.download.update({
      where: { id },
      data: {
        emailOpenCount: { increment: 1 },
        ...(exists.emailFirstOpenedAt == null && {
          emailFirstOpenedAt: new Date(),
        }),
      },
    });
  }

  return new Response(TRANSPARENT_PNG, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(TRANSPARENT_PNG.length),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
