import Link from "next/link";
import {
  MessageSquare,
  Download,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * /admin — 관리자 대시보드 (기획문서 4.2).
 *
 * 위젯 4 개:
 *   1. 문의 현황 (신규 / 최근 7일 / 전체)
 *   2. 다운로드 현황 (최근 7일 / 전체)
 *   3. 블로그 현황 (발행 / 초안)
 *   4. 빠른 액션 (새 글 / 문의 확인 / 약관 관리)
 *
 * 서버 컴포넌트에서 Prisma 직접 호출 (API 우회).
 */
export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    inquiriesTotal,
    inquiriesNew,
    inquiriesRecent,
    downloadsTotal,
    downloadsRecent,
    blogPostsTotal,
    blogPostsPublished,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.download.count(),
    prisma.download.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
  ]);

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          Dashboard
        </p>
        <h1 className="text-[28px] font-medium leading-[1.2] text-[#282828] md:text-[32px]">
          {user.email?.split("@")[0] ?? "관리자"} 님, 안녕하세요
        </h1>
        <p className="mt-1 text-[14px] text-[#5f6363]">
          오늘의 문의와 다운로드 현황을 확인하세요.
        </p>
      </div>

      {/* 3 stat cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
        <StatCard
          icon={MessageSquare}
          label="도입 문의"
          value={inquiriesTotal}
          trend={`최근 7일 +${inquiriesRecent}`}
          sub={
            inquiriesNew > 0
              ? `${inquiriesNew}건의 신규 문의가 대기 중`
              : "확인 대기 0건"
          }
          href="/admin/inquiries"
          accent="text-[var(--color-primary)]"
          accentBg="bg-[var(--color-primary-light)]"
          highlightNew={inquiriesNew}
        />
        <StatCard
          icon={Download}
          label="소개서 다운로드"
          value={downloadsTotal}
          trend={`최근 7일 +${downloadsRecent}`}
          sub={`누적 다운로드 ${downloadsTotal}건`}
          href="/admin/downloads"
          accent="text-[#0891b2]"
          accentBg="bg-[#ecfeff]"
        />
        <StatCard
          icon={FileText}
          label="블로그 게시글"
          value={blogPostsTotal}
          trend={`발행 ${blogPostsPublished}`}
          sub={`초안 ${blogPostsTotal - blogPostsPublished}건`}
          href="/admin/blog"
          accent="text-[#7c3aed]"
          accentBg="bg-[#f5f3ff]"
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
              Quick Actions
            </p>
            <p className="mt-1 text-[16px] font-semibold text-[#282828]">
              빠른 작업
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            icon={Plus}
            label="새 글 작성"
            desc="블로그 글 작성 에디터 열기"
            href="/admin/blog/new"
          />
          <QuickAction
            icon={MessageSquare}
            label="문의 확인"
            desc="신규 도입 문의 응대"
            href="/admin/inquiries"
            badge={inquiriesNew > 0 ? String(inquiriesNew) : undefined}
          />
          <QuickAction
            icon={FileText}
            label="약관 관리"
            desc="개인정보/이용약관 버전 편집"
            href="/admin/terms"
          />
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  trend: string;
  sub: string;
  href: string;
  accent: string;
  accentBg: string;
  highlightNew?: number;
};

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  sub,
  href,
  accent,
  accentBg,
  highlightNew,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentBg} ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {typeof highlightNew === "number" && highlightNew > 0 && (
          <span className="inline-flex items-center rounded-full bg-[var(--color-error)] px-2 py-0.5 text-[11px] font-semibold text-white">
            NEW {highlightNew}
          </span>
        )}
      </div>
      <div>
        <p className="text-[13px] font-medium text-[#5f6363]">{label}</p>
        <p className="mt-1 text-[36px] font-semibold leading-none text-[#282828]">
          {value}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-center gap-1.5 text-[12px] text-[#5f6363]">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </div>
        <ArrowRight className="h-4 w-4 text-[#5f6363] transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="text-[12px] text-[#5f6363]">{sub}</p>
    </Link>
  );
}

type QuickActionProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  href: string;
  badge?: string;
};

function QuickAction({
  icon: Icon,
  label,
  desc,
  href,
  badge,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-primary)]/30"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[14px] font-semibold text-[#282828]">
          {label}
          {badge && (
            <span className="inline-flex items-center rounded-full bg-[var(--color-error)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {badge}
            </span>
          )}
        </p>
        <p className="mt-0.5 text-[12px] text-[#5f6363]">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-[#5f6363] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
