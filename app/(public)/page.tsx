import type { Metadata } from "next";
import Link from "next/link";
import { getStaticPageMeta } from "@/lib/seo";
import { SectionTracker } from "@/components/analytics/SectionTracker";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { PainPoints } from "@/components/landing/PainPoints";
import { SolutionBridge } from "@/components/landing/SolutionBridge";
import { CoreFeatures } from "@/components/landing/CoreFeatures";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CLevelPerspective } from "@/components/landing/CLevelPerspective";
import { Metrics } from "@/components/landing/Metrics";
import { SecurityIntegration } from "@/components/landing/SecurityIntegration";
import { Faqs } from "@/components/landing/Faqs";
import { ContactCta } from "@/components/landing/ContactCta";
import { FloatingCta } from "@/components/landing/FloatingCta";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/");
}

/**
 * v3 narrative (11 섹션):
 *   hero → logos → problem(3버킷) → solution(chat demo) → how_it_works
 *   → clevel(경영진 관점) → features(4카드) → results(지표+증언)
 *   → enterprise(4카드) → faqs → final_cta
 */
export default function HomePage() {
  return (
    <>
      <SectionTracker id="hero">
        <header className="pb-8 pt-8 md:pb-10 md:pt-10 lg:pb-12 lg:pt-12">
          <div className="wp-container">
            <div className="grid gap-10 md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              {/* 좌측: 텍스트 영역 — v3 Problem-first 헤드라인
                   모바일/태블릿(stacked) = 중앙 정렬, 데스크톱(≥lg, 2-col) = 좌측 정렬 */}
              <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary-light)]/60 px-3 py-1 text-[13px] font-medium leading-[1.5] text-[var(--color-primary)]">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
                  />
                  AI 채용 면접 자동화
                </span>

                <h1 className="mt-5 text-[2.25rem] font-semibold leading-[1.2] tracking-[-0.03em] text-[#282828] md:text-[3rem] lg:text-[3.25rem]">
                  좋은 인재,
                  <br />
                  <span className="text-[var(--color-primary)]">
                    직감 말고 데이터로
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-[17px] leading-[1.7] text-[#5f6363] md:text-[18px]">
                  이력서 검증부터 역량 면접, 평가 리포트까지.
                  <br />
                  채용팀의 판단이 데이터로 단단해집니다.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link
                    href="/contact"
                    data-track="cta_hero_contact"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                  >
                    무료 데모 신청하기 →
                  </Link>
                  <Link
                    href="/download"
                    data-track="cta_hero_download"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
                  >
                    소개서 다운로드
                  </Link>
                </div>

                <p className="mt-4 text-[13px] text-[#9099a3]">
                  1영업일 내 컨택 · 30일 무료 체험 · 별도 설치 없음
                </p>
              </div>

              {/* 우측: 5-단계 파이프라인 시각 */}
              <div className="flex w-full items-start lg:pt-4">
                <HeroVisual />
              </div>
            </div>
          </div>
        </header>
      </SectionTracker>

      <SectionTracker id="logos">
        <div className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)]">
          <div className="wp-container">
            <LogoMarquee />
          </div>
        </div>
      </SectionTracker>

      <SectionTracker id="problem"><PainPoints /></SectionTracker>
      <SectionTracker id="solution"><SolutionBridge /></SectionTracker>
      <SectionTracker id="how_it_works"><HowItWorks /></SectionTracker>
      <SectionTracker id="clevel"><CLevelPerspective /></SectionTracker>
      <SectionTracker id="features"><CoreFeatures /></SectionTracker>
      <SectionTracker id="results"><Metrics /></SectionTracker>
      <SectionTracker id="enterprise"><SecurityIntegration /></SectionTracker>
      <SectionTracker id="faqs"><Faqs /></SectionTracker>
      <SectionTracker id="final_cta"><ContactCta /></SectionTracker>

      <FloatingCta />
    </>
  );
}
