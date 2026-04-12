import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/analytics — 배치 이벤트 수신 + 카운터 upsert.
 *
 * body: { sessionId: uuid, events: [{type, path, section?, label?, value?}] }
 *
 * Raw event 저장 안 함 — 카운터만 upsert + increment.
 * 실패 시 silent 응답 (사용자 UX 무영향).
 *
 * docs/analytics-spec.md 참고.
 */

const eventSchema = z.object({
  type: z.enum(["section_view", "cta_click", "dwell"]),
  path: z.string().max(1024),
  section: z.string().max(64).optional(),
  label: z.string().max(128).optional(),
  value: z
    .number()
    .int()
    .min(0)
    .max(3_600_000)
    .optional(),
});

const batchSchema = z.object({
  sessionId: z.string().min(1).max(128),
  events: z.array(eventSchema).min(1).max(50),
});

function isPublicPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("/admin")) return false;
  if (path.startsWith("/api")) return false;
  if (path.startsWith("/_next")) return false;
  return true;
}

export async function POST(request: Request) {
  // 봇 필터 (page-views 와 동일 패턴)
  const ua = request.headers.get("user-agent") ?? "";
  if (/bot|crawler|spider|headlesschrome/i.test(ua)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = batchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 이벤트 타입별 카운터 upsert 를 하나의 $transaction 배열로
  const operations: Prisma.PrismaPromise<unknown>[] = [];

  for (const event of parsed.data.events) {
    if (!isPublicPath(event.path)) continue;

    switch (event.type) {
      case "section_view":
        if (event.section) {
          operations.push(
            prisma.sectionView.upsert({
              where: {
                path_section: {
                  path: event.path,
                  section: event.section,
                },
              },
              update: { viewCount: { increment: 1 } },
              create: {
                path: event.path,
                section: event.section,
                viewCount: 1,
              },
            }),
          );
        }
        break;

      case "cta_click":
        if (event.label) {
          operations.push(
            prisma.ctaClick.upsert({
              where: {
                path_label: { path: event.path, label: event.label },
              },
              update: { clickCount: { increment: 1 } },
              create: {
                path: event.path,
                label: event.label,
                clickCount: 1,
              },
            }),
          );
        }
        break;

      case "dwell":
        if (typeof event.value === "number" && event.value > 0) {
          operations.push(
            prisma.pageDwell.upsert({
              where: { path: event.path },
              update: {
                totalMs: { increment: BigInt(event.value) },
                sampleCount: { increment: 1 },
              },
              create: {
                path: event.path,
                totalMs: BigInt(event.value),
                sampleCount: 1,
              },
            }),
          );
        }
        break;
    }
  }

  if (operations.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  try {
    await prisma.$transaction(operations);
    return NextResponse.json({ ok: true, count: operations.length });
  } catch (err) {
    console.error("[api/analytics] POST failed:", err);
    // 실패해도 사용자에게 에러 노출하지 않음
    return NextResponse.json({ ok: true, error: "silent" });
  }
}
