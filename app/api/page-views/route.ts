import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/page-views — 공개 페이지 방문 기록.
 *
 * 클라이언트 `PageViewTracker` 컴포넌트가 경로 변경 시 호출.
 * body: { path: string }
 *
 * 단순 append. 집계/그룹핑은 관리자 대시보드 조회 시점에 수행.
 *
 * 신뢰 경계: 공개 엔드포인트이므로 악용 가능. 다음으로 방어:
 *   - path 는 "/" 로 시작 + 1024자 이하 + 내부 경로만 허용 (관리자/API 제외)
 *   - user-agent/referer 는 저장만 (향후 봇 필터용)
 *   - 심각한 abuse 시 Vercel rate limit 또는 별도 솔루션 추가
 */
export async function POST(request: Request) {
  let body: { path?: unknown; referer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawPath = typeof body.path === "string" ? body.path : null;
  if (!rawPath) {
    return NextResponse.json(
      { error: "path (string) 필드가 필요합니다" },
      { status: 400 },
    );
  }

  // 경로 정규화 + 화이트리스트
  const path = normalizePath(rawPath);
  if (!path || !isPublicPath(path)) {
    return NextResponse.json(
      { ok: true, skipped: true },
      { status: 200 },
    );
  }

  const referer =
    typeof body.referer === "string" && body.referer.length <= 2048
      ? body.referer
      : null;
  const userAgent = request.headers.get("user-agent");

  // 봇 기본 필터 (완벽하진 않음, 명백한 것만)
  if (userAgent && /bot|crawler|spider|headlesschrome/i.test(userAgent)) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
  }

  try {
    // 카운터 캐시 증분:
    //   1. PageView raw append (기존 로직)
    //   2. Stats.pageViewsTotal +1 (singleton)
    //   3. 경로가 /blog/{slug} 면 해당 BlogPost.viewCount +1
    // updateMany 는 match 0 건이어도 에러 없이 count:0 반환 → 안전.
    const isBlogPath = path.startsWith("/blog/");
    const blogSlug = isBlogPath
      ? path.replace(/^\/blog\//, "").replace(/\/$/, "")
      : null;

    const operations: Prisma.PrismaPromise<unknown>[] = [
      prisma.pageView.create({
        data: {
          path,
          referer,
          userAgent: userAgent?.slice(0, 512) ?? null,
        },
      }),
      prisma.stats.update({
        where: { id: "singleton" },
        data: { pageViewsTotal: { increment: 1 } },
      }),
    ];
    if (blogSlug) {
      operations.push(
        prisma.blogPost.updateMany({
          where: { slug: blogSlug, status: "PUBLISHED" },
          data: { viewCount: { increment: 1 } },
        }),
      );
    }
    await prisma.$transaction(operations);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/page-views] POST failed:", err);
    // 실패해도 클라이언트에 에러를 노출할 필요 없음 (사용자 UX 무관)
    return NextResponse.json({ ok: true, error: "silent" });
  }
}

function normalizePath(input: string): string | null {
  if (!input.startsWith("/")) return null;
  if (input.length > 1024) return null;
  // query string / hash 제거
  const noQuery = input.split("?")[0].split("#")[0];
  // 연속 / 제거
  return noQuery.replace(/\/{2,}/g, "/");
}

function isPublicPath(path: string): boolean {
  // 관리자 / API / next 내부 경로는 추적 안 함
  if (path.startsWith("/admin")) return false;
  if (path.startsWith("/api")) return false;
  if (path.startsWith("/_next")) return false;
  if (path === "/favicon.ico") return false;
  return true;
}
