import Link from "next/link";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { PainPoints } from "@/components/landing/PainPoints";
import { SolutionBridge } from "@/components/landing/SolutionBridge";
import { KobiIntro } from "@/components/landing/KobiIntro";

export default function HomePage() {
  return (
    <>
      {/*
        Hero — Maki .g_page--section 구조 매칭.
          <header>                               ← block, 시맨틱 hero section
            <div className="wp-container">       ← g_page--container (1296px / 56px side padding)
              <div className="grid …">           ← g_layout--row + g_layout--12cols 역할 (단순 2-col grid)
                ├ 좌측 flex-col                  ← g_flex--dvlc_tvct (텍스트 영역)
                └ 우측 HeroVisual                ← g_layout--row (시각 영역)
              <LogoMarquee />                    ← .c_logo_marquee (로고 티커, hero 내부 div)
        반응형:
          - < lg: 1 컬럼 stacked (텍스트 위 / 시각 아래)
          - ≥ lg: 2 컬럼 [텍스트 1fr | 시각 1fr] 대칭
      */}
      <header className="pb-8 pt-8 md:pb-10 md:pt-10 lg:pb-12 lg:pt-12">
        <div className="wp-container">
          <div className="grid gap-10 md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            {/* 좌측: 텍스트 영역 — Maki g_flex--dvlc_tvct */}
            <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
              {/* Eyebrow — Maki .g_label 매칭
                  12px / 15.6px / uppercase / #5f6363
                  border 1px solid + rounded-full pill + padding 4px 8px */}
              <span className="inline-flex items-center rounded-full border border-[#f0efe6] px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
                AI Agent 채용
              </span>

              {/* H1 — Maki .g_title--3xl 매칭
                  font-size: 5rem (80px), mobile ≤767px: 4rem (64px)
                  font-weight: 500, line-height: 100%, color: #282828 */}
              <h1 className="mt-4 text-[4rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[5rem]">
                코비가 채용의 모든 과정을 자동화합니다.
              </h1>

              {/* Body paragraph — Maki --font-size--body--l 반응형
                  ≥768px: 20px / 1.5, ≤767px: 18px / 1.5 */}
              <p className="mt-6 w-full text-[18px] font-normal leading-[1.5] tracking-normal text-[#5f6363] md:text-[20px]">
                슈퍼코더 AI Interviewer 는 채용공고 분석부터 역량 추출, 실시간
                AI 면접, 평가 리포트까지 한 번에 처리하는 풀스택 채용 자동화
                플랫폼입니다.
              </p>

              {/* CTA buttons — Maki .g_button_primary / .g_button_secondary 매칭
                  gap 0.5rem · radius 0.5rem · 16px / 600 / 150% · padding 1rem 2rem */}
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

            {/* 우측(데스크톱) / 하단(모바일·태블릿) 시각 영역 — Maki .g_layout--row (width: 100%) */}
            <div className="flex w-full items-start lg:pt-4">
              <HeroVisual />
            </div>
          </div>

          {/* 로고 티커 — Maki .c_logo_marquee (hero 내부 div) */}
          <LogoMarquee />
        </div>
      </header>

      {/* 기획문서 3.1 Section 2 — Pain Points (HR 담당자 3가지 고충) */}
      <PainPoints />

      {/* 기획문서 3.1 Section 3 — Solution Bridge (전환 섹션: 채용공고 하나로) */}
      <SolutionBridge />

      {/* 기획문서 3.1 Section 4 — Kobi Intro (AI Screening Agent 소개) */}
      <KobiIntro />
    </>
  );
}
