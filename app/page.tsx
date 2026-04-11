import Link from "next/link";
import { HeroVisual } from "@/components/landing/HeroVisual";

export default function HomePage() {
  return (
    <>
      {/* Hero (Phase 0 임시). Phase 1 에서 풀 랜딩으로 교체 예정.
          반응형:
            - < lg (1024px): 1 컬럼 (텍스트 위 → 시각 아래), 각 row width 100%
            - ≥ lg (1024px): 2 컬럼 [텍스트 1fr | 시각 1fr] 대칭 — Maki 의 hero grid 1fr 1fr 매칭
          모든 row 는 Maki .g_layout--row { width:100% } 스펙대로 셀을 100% 채운다. */}
      <section className="wp-container grid gap-12 py-16 md:gap-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:py-32">
        <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
          {/* Maki .g_label 매칭: 12px / 15.6px / uppercase / #5f6363
              border 1px solid + border-radius 120px (pill) + padding 4px 8px */}
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            AI Agent 채용
          </span>

          {/* Maki 완전 매칭:
              - font-size: 5rem (80px), mobile ≤767px: 4rem (64px)
              - font-weight: 500
              - line-height: 100%
              - color: #282828 (var(--_modes---text--1))
              - letter-spacing: normal */}
          <h1 className="mt-4 text-[4rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[5rem]">
            코비가 채용의 모든 과정을 자동화합니다.
          </h1>

          {/* Maki 반응형 스케일:
              - ≥768px: 1.25rem (20px) / line-height 1.5 (= 30px)
              - ≤767px: 1.125rem (18px) / line-height 1.5 (= 27px)
              .g_layout--row { width:100% } 에 맞춰 max-width 없음 */}
          <p className="mt-6 w-full text-[18px] font-normal leading-[1.5] tracking-normal text-[#5f6363] md:text-[20px]">
            슈퍼코더 AI Interviewer 는 채용공고 분석부터 역량 추출, 실시간 AI
            면접, 평가 리포트까지 한 번에 처리하는 풀스택 채용 자동화
            플랫폼입니다.
          </p>

          {/* Maki .g_button_primary / .g_button_secondary 스펙 완전 매칭:
              gap 0.5rem · radius 0.5rem · 16px font · 600 weight · line-height 150% · padding 1rem 2rem
              (색상은 브랜드 블루 유지) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              도입 문의하기
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
            >
              소개서 다운로드
            </Link>
          </div>
        </div>

        {/* 우측(데스크톱) / 하단(모바일·태블릿) 시각 영역 — Maki 레퍼런스.
            Maki .g_layout--row { width: 100% } 규칙에 맞춰 stacked 모드에서도 grid cell full width 확장 */}
        <div className="flex w-full items-start lg:pt-4">
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
