import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, Shield } from "lucide-react";
import { getStaticPageMeta } from "@/lib/seo";

/**
 * /trial — 무료 체험 플레이스홀더 (기획문서 3.2).
 * 실제 AI 면접 체험 UI 는 범위 외. 여기서는:
 *   - 상단 Hero: "곧 출시" 라벨 + H1 + subtitle + CTA 2개
 *   - 가운데: 데모 영상 자리 (16:9 placeholder)
 *   - 하단: 3가지 이점 카드 + 최종 CTA 배너
 */

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/trial");
}

const benefits = [
  {
    icon: Clock,
    title: "10 분 셋업",
    text: "채용공고 하나만 있으면 10 분 내 역량 추출부터 면접 질문 자동 생성까지.",
  },
  {
    icon: Sparkles,
    title: "실제 사례 기반",
    text: "귀사의 포지션에 맞춰 AI 면접 플로우를 직접 시연합니다.",
  },
  {
    icon: Shield,
    title: "기업 보안 완료",
    text: "ISO 27001 · 데이터 암호화 · 국내 리전. 보안 검토 자료 즉시 제공.",
  },
];

export default function TrialPage() {
  return (
    <div className="bg-white">
      {/* ────────────── 1. Hero ────────────── */}
      <header className="wp-container pb-12 pt-16 md:pb-16 md:pt-24 lg:pt-28">
        <div className="flex flex-col items-start">
          {/* Coming soon eyebrow */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0efe6] bg-white px-2.5 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            <Sparkles className="h-3 w-3 text-[var(--color-primary)]" />
            Coming soon
          </span>

          {/* H1 — g_title--xl */}
          <h1 className="mt-4 text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4.25rem]">
            AI 면접을
            <br />
            직접 체험해보세요
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px] md:leading-[30px]">
            공개 체험 페이지는 곧 출시됩니다. 지금은 슈퍼코더 팀이 직접
            진행하는 1:1 맞춤 데모로, 귀사의 포지션에 맞춘 AI 면접 플로우를
            시연해 드립니다.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              데모 신청하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
            >
              소개서 받기
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────── 2. Demo video — YouTube 16:9 ────────────── */}
      <div className="wp-container pb-16 md:pb-24">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black">
          <iframe
            src="https://www.youtube.com/embed/YQztpRr55ro?rel=0&modestbranding=1"
            title="슈퍼코더 AI Interviewer — 데모 영상"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      {/* ────────────── 3. Benefits 3-card ────────────── */}
      <div className="wp-container pb-20 md:pb-28">
        <div className="border-t border-[var(--color-border)] pt-16 md:pt-20">
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              Why demo first
            </span>
            <h2 className="mt-4 text-[2rem] font-medium leading-[1.15] text-[#282828] md:text-[2.75rem]">
              데모에서 얻을 수 있는 것
            </h2>
          </div>

          <ul className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-7">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <li
                  key={b.title}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[18px] font-semibold leading-[1.3] text-[#282828] md:text-[20px]">
                      {b.title}
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.55] text-[#5f6363] md:text-[15px]">
                      {b.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ────────────── 4. Final CTA banner ────────────── */}
      <div className="wp-container pb-20 md:pb-28">
        <div className="overflow-hidden rounded-2xl bg-[var(--color-primary)] px-6 py-14 md:px-12 md:py-16 lg:px-16 lg:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="text-[1.75rem] font-medium leading-[1.15] text-white md:text-[2.5rem]">
              먼저 데모로 확인해보세요
            </h2>
            <p className="mt-4 text-[15px] leading-[1.55] text-white/80 md:text-[17px]">
              1 영업일 내 맞춤 데모 제안 · 무료 체험 30일 · 기업 보안 검토 완료
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold leading-[1.5] text-[var(--color-primary)] transition-colors hover:bg-white/90"
              >
                데모 신청하기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/download"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-colors hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)]"
              >
                소개서 받기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
