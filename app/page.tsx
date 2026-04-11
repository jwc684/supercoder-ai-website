import Link from "next/link";
import { HeroVisual } from "@/components/landing/HeroVisual";

export default function HomePage() {
  return (
    <>
      {/* Hero (Phase 0 임시). Phase 1 에서 풀 랜딩으로 교체 예정. */}
      <section className="wp-container grid gap-12 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,480px)] md:gap-16 md:py-28 lg:gap-20 lg:py-32">
        <div className="flex flex-col items-start">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-sub)]">
            HIRING POWERED BY KOBI
          </p>

          <h1 className="mt-4 text-[44px] font-bold leading-[1] tracking-normal text-[var(--color-text)] md:text-[64px] lg:text-[80px]">
            코비가 채용의
            <br />
            모든 과정을
            <br />
            자동화합니다.
          </h1>

          <p className="mt-6 max-w-xl text-[20px] font-normal leading-[30px] tracking-normal text-[var(--color-text-sub)]">
            슈퍼코더 AI Interviewer 는 채용공고 분석부터 역량 추출, 실시간 AI
            면접, 평가 리포트까지 한 번에 처리하는 풀스택 채용 자동화
            플랫폼입니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex h-[45px] items-center rounded-lg bg-[var(--color-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              도입 문의하기
            </Link>
            <Link
              href="/download"
              className="inline-flex h-[45px] items-center rounded-lg border border-[var(--color-border)] bg-white px-6 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              소개서 다운로드
            </Link>
          </div>
        </div>

        {/* 우측 시각 영역 — Maki 레퍼런스 */}
        <div className="flex items-start justify-center md:pt-4">
          <HeroVisual />
        </div>
      </section>

      {/* Phase 0 체크리스트 (임시, Phase 1 에서 제거 예정) */}
      <section className="wp-container pb-24">
        <div className="w-full rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8">
          <h2 className="text-sm font-semibold text-[var(--color-text-sub)]">
            Phase 0 체크리스트
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--color-text)] md:grid-cols-2">
            <li>✅ Next.js 16 + App Router + TypeScript</li>
            <li>✅ Tailwind v4 + 브랜드 토큰</li>
            <li>✅ Pretendard 폰트</li>
            <li>✅ Supabase SSR 클라이언트</li>
            <li>✅ Auth 보호 미들웨어</li>
            <li>✅ Prisma schema (5 모델)</li>
            <li>✅ Header / Footer 공통 레이아웃 (Maki 룰)</li>
            <li>✅ Supabase 마이그레이션 (5 테이블)</li>
          </ul>
          <p className="mt-4 text-xs text-[var(--color-text-sub)]">
            Phase 1 에서는 랜딩 페이지 12 개 섹션을 구현합니다.
          </p>
        </div>
      </section>
    </>
  );
}
