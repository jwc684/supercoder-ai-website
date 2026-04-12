import Link from "next/link";
import {
  Eye,
  MousePointer,
  Clock,
  Clock3,
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * /admin/analytics — 행동 분석 대시보드.
 *
 * 4 위젯:
 *   1. Section Funnel (/) — 가로 바 차트 + drop-off %
 *   2. Top CTAs — 클릭 수 랭킹
 *   3. Average Dwell — 페이지별 평균 체류 시간
 *   4. Device Breakdown — 디바이스별 방문 비율
 *
 * docs/analytics-spec.md 참고.
 */

// 섹션 ID 의 표시 순서 (랜딩 페이지 순서대로)
const SECTION_ORDER = [
  "hero",
  "pain_points",
  "solution_bridge",
  "kobi_intro",
  "core_features",
  "how_it_works",
  "ai_service_detail",
  "candidate_experience",
  "metrics",
  "customer_logos",
  "security_integration",
  "faqs",
  "contact_cta",
];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  pain_points: "Pain Points",
  solution_bridge: "Solution Bridge",
  kobi_intro: "Kobi Intro",
  core_features: "Core Features",
  how_it_works: "How It Works",
  ai_service_detail: "AI Service Detail",
  candidate_experience: "Candidate Experience",
  metrics: "Metrics",
  customer_logos: "Customer Logos",
  security_integration: "Security & Integration",
  faqs: "FAQs",
  contact_cta: "Contact CTA",
};

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [sections, ctas, dwells, deviceRows, hourlyRows] = await Promise.all([
    prisma.sectionView.findMany({
      where: { path: "/" },
      orderBy: { viewCount: "desc" },
    }),
    prisma.ctaClick.findMany({
      orderBy: { clickCount: "desc" },
      take: 20,
    }),
    prisma.pageDwell.findMany({
      orderBy: { sampleCount: "desc" },
    }),
    // 디바이스별 방문 집계 (전체 경로 합산)
    prisma.deviceView.groupBy({
      by: ["device"],
      _sum: { viewCount: true },
      orderBy: { _sum: { viewCount: "desc" } },
    }),
    // 시간대별 방문 (0~23시)
    prisma.hourlyView.findMany({
      orderBy: { hour: "asc" },
    }),
  ]);

  // Section funnel 데이터 정리 (순서 고정)
  const sectionMap = new Map(sections.map((s) => [s.section, s.viewCount]));
  const heroViews = sectionMap.get("hero") ?? 1;

  const funnelData = SECTION_ORDER.map((id) => {
    const count = sectionMap.get(id) ?? 0;
    const pct = heroViews > 0 ? Math.round((count / heroViews) * 100) : 0;
    return { id, label: SECTION_LABELS[id] ?? id, count, pct };
  });

  // Dwell 평균 계산
  const dwellData = dwells.map((d) => ({
    path: d.path,
    avgMs:
      d.sampleCount > 0
        ? Math.round(Number(d.totalMs) / d.sampleCount)
        : 0,
    samples: d.sampleCount,
  }));

  // 디바이스 비율 계산
  const deviceData = deviceRows.map((d) => ({
    device: d.device,
    count: d._sum.viewCount ?? 0,
  }));
  const deviceTotal = deviceData.reduce((s, d) => s + d.count, 0);

  // 시간대별 데이터 (0~23시, 빈 시간은 0으로 채움)
  const hourlyMap = new Map(hourlyRows.map((h) => [h.hour, h.viewCount]));
  const maxHourly = Math.max(1, ...hourlyRows.map((h) => h.viewCount));
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i}시`,
    count: hourlyMap.get(i) ?? 0,
    pct: Math.round(((hourlyMap.get(i) ?? 0) / maxHourly) * 100),
  }));
  // 피크 시간 찾기
  const peakHour = hourlyData.reduce((a, b) => (b.count > a.count ? b : a), hourlyData[0]);

  const DEVICE_META: Record<
    string,
    { label: string; icon: typeof Monitor; color: string; bg: string }
  > = {
    desktop: { label: "Desktop", icon: Monitor, color: "text-[var(--color-primary)]", bg: "bg-[var(--color-primary)]" },
    mobile: { label: "Mobile", icon: Smartphone, color: "text-[#16a34a]", bg: "bg-[#16a34a]" },
    tablet: { label: "Tablet", icon: Tablet, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]" },
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Analytics
        </p>
        <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
          행동 분석
        </h1>
        <p className="mt-1 text-[14px] text-[#5f6363]">
          랜딩 페이지의 섹션별 도달률 · CTA 클릭 · 페이지 체류 시간을
          확인합니다. (누적 전체 기간)
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* 1. Section Funnel */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                Section Funnel
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[#282828]">
                섹션별 도달률 (/)
              </p>
              <p className="mt-0.5 text-[12px] text-[#9ca3af]">
                Hero 기준 잔존율 — 50% 가시 시 세션당 1회 카운트
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>

          {funnelData.length === 0 ? (
            <p className="mt-6 text-center text-[13px] text-[#5f6363]">
              아직 기록된 데이터가 없습니다
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-3">
              {funnelData.map((s, i) => {
                const prevPct = i > 0 ? funnelData[i - 1].pct : 100;
                const dropOff = prevPct - s.pct;
                return (
                  <li key={s.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3 text-[13px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#f8f9fa] text-[10px] font-semibold text-[#9ca3af]">
                          {i + 1}
                        </span>
                        <span className="font-medium text-[#282828]">
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px]">
                        <span className="tabular-nums font-semibold text-[#282828]">
                          {s.count.toLocaleString()}
                        </span>
                        <span className="w-12 text-right tabular-nums text-[#5f6363]">
                          {s.pct}%
                        </span>
                        {dropOff > 0 && (
                          <span className="w-14 text-right tabular-nums text-[var(--color-error)]">
                            ↓{dropOff}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0f1f3]">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 2. Top CTAs */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                Top CTAs
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[#282828]">
                CTA 클릭 순위
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f3ff] text-[#7c3aed]">
              <MousePointer className="h-5 w-5" />
            </div>
          </div>

          {ctas.length === 0 ? (
            <p className="mt-6 text-center text-[13px] text-[#5f6363]">
              아직 기록된 클릭이 없습니다
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-1">
              {ctas.map((c, i) => {
                const max = ctas[0]?.clickCount ?? 1;
                const pct = Math.round((c.clickCount / max) * 100);
                return (
                  <li
                    key={`${c.path}-${c.label}`}
                    className="flex flex-col gap-1.5 rounded-lg px-2 py-2 transition-colors hover:bg-[#f8f9fa]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[13px]">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#f5f3ff] text-[10px] font-bold text-[#7c3aed]">
                          {i + 1}
                        </span>
                        <span className="font-medium text-[#282828]">
                          {c.label}
                        </span>
                        <span className="text-[11px] text-[#9ca3af]">
                          {c.path}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] font-semibold tabular-nums text-[#282828]">
                        <MousePointer className="h-3 w-3 text-[#9ca3af]" />
                        {c.clickCount.toLocaleString()}
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f0f1f3]">
                      <div
                        className="h-full rounded-full bg-[#7c3aed]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 3. Average Dwell */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                Average Dwell Time
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[#282828]">
                페이지별 평균 체류 시간
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0fdf4] text-[#16a34a]">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          {dwellData.length === 0 ? (
            <p className="mt-6 text-center text-[13px] text-[#5f6363]">
              아직 기록된 체류 데이터가 없습니다
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-1">
              {dwellData.map((d) => (
                <li
                  key={d.path}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#f8f9fa]"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={d.path}
                      target="_blank"
                      className="truncate text-[13px] font-medium text-[#282828] hover:text-[var(--color-primary)]"
                    >
                      {d.path}
                    </Link>
                    <p className="text-[11px] text-[#9ca3af]">
                      n={d.samples.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-[14px] font-semibold tabular-nums text-[#282828]">
                    <Clock className="h-3 w-3 text-[#9ca3af]" />
                    {formatDwell(d.avgMs)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 4. Device Breakdown */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                Device Breakdown
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[#282828]">
                디바이스별 방문 비율
              </p>
              {deviceTotal > 0 && (
                <p className="mt-0.5 text-[12px] text-[#9ca3af]">
                  Total: {deviceTotal.toLocaleString()} views
                </p>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff4ff] text-[var(--color-primary)]">
              <Monitor className="h-5 w-5" />
            </div>
          </div>

          {deviceData.length === 0 ? (
            <p className="mt-6 text-center text-[13px] text-[#5f6363]">
              아직 기록된 방문 데이터가 없습니다
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-4">
              {(["desktop", "mobile", "tablet"] as const).map((key) => {
                const row = deviceData.find((d) => d.device === key);
                const count = row?.count ?? 0;
                const pct =
                  deviceTotal > 0
                    ? Math.round((count / deviceTotal) * 100)
                    : 0;
                const meta = DEVICE_META[key];
                const Icon = meta.icon;
                return (
                  <li key={key} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-5 w-5 ${meta.color}`} />
                        <span className="text-[14px] font-medium text-[#282828]">
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px]">
                        <span className="tabular-nums font-semibold text-[#282828]">
                          {count.toLocaleString()}
                        </span>
                        <span className="w-10 text-right tabular-nums text-[#5f6363]">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f0f1f3]">
                      <div
                        className={`h-full rounded-full ${meta.bg} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 5. Hourly Traffic — 시간대별 방문 */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                Hourly Traffic
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[#282828]">
                시간대별 방문 분포 (0~23시)
              </p>
              {peakHour && peakHour.count > 0 && (
                <p className="mt-0.5 text-[12px] text-[#9ca3af]">
                  피크 시간: <span className="font-semibold text-[var(--color-primary)]">{peakHour.label}</span>{" "}
                  ({peakHour.count.toLocaleString()} views)
                </p>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fef3c7] text-[#f59e0b]">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>

          {hourlyData.every((h) => h.count === 0) ? (
            <p className="mt-6 text-center text-[13px] text-[#5f6363]">
              아직 기록된 방문 데이터가 없습니다
            </p>
          ) : (
            <div className="mt-5 flex items-end gap-[3px] md:gap-1" style={{ height: 120 }}>
              {hourlyData.map((h) => (
                <div
                  key={h.hour}
                  className="group relative flex flex-1 flex-col items-center"
                  style={{ height: "100%" }}
                >
                  {/* 바 */}
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t transition-all ${
                        h.hour === peakHour.hour
                          ? "bg-[var(--color-primary)]"
                          : "bg-[var(--color-primary)]/40 group-hover:bg-[var(--color-primary)]/70"
                      }`}
                      style={{
                        height: `${Math.max(h.pct, h.count > 0 ? 4 : 0)}%`,
                        minHeight: h.count > 0 ? 4 : 0,
                      }}
                    />
                  </div>
                  {/* 시간 라벨 (짝수 시간만 표시 — 공간 절약) */}
                  <span className="mt-1 text-[9px] tabular-nums text-[#9ca3af] md:text-[10px]">
                    {h.hour % 2 === 0 ? h.hour : ""}
                  </span>
                  {/* Hover 툴팁 */}
                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#282828] px-1.5 py-0.5 text-[10px] tabular-nums text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {h.label}: {h.count}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-right text-[10px] text-[#9ca3af]">
            서버 시각 기준 (UTC+9 KST)
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDwell(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${sec}s`;
}
