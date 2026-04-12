import type { Metadata } from "next";
import Link from "next/link";
import { getStaticPageMeta } from "@/lib/seo";
import { SectionTracker } from "@/components/analytics/SectionTracker";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { PainPoints } from "@/components/landing/PainPoints";
import { SolutionBridge } from "@/components/landing/SolutionBridge";
import { KobiIntro } from "@/components/landing/KobiIntro";
import { CoreFeatures } from "@/components/landing/CoreFeatures";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AiServiceDetail } from "@/components/landing/AiServiceDetail";
import { CandidateExperience } from "@/components/landing/CandidateExperience";
import { Metrics } from "@/components/landing/Metrics";
import { CustomerLogos } from "@/components/landing/CustomerLogos";
import { SecurityIntegration } from "@/components/landing/SecurityIntegration";
import { Faqs } from "@/components/landing/Faqs";
import { ContactCta } from "@/components/landing/ContactCta";
import { FloatingCta } from "@/components/landing/FloatingCta";

// ISR 60s — FAQ 가 DB 에 있고, Prisma 호출은 자동으로 dynamic 하지 않으므로
// revalidate 를 명시해서 관리자 변경이 랜딩에 60초 내 반영되도록 한다.
export const revalidate = 60;

// PageMeta ("/") 조회 + 관리자 편집 가능한 SEO 메타 렌더.
// /admin/seo 에서 편집 즉시 revalidatePath 로 무효화됨.
export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/");
}

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
      <SectionTracker id="hero">
      <header className="pb-8 pt-8 md:pb-10 md:pt-10 lg:pb-12 lg:pt-12">
        <div className="wp-container">
          <div className="grid gap-10 md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            {/* 좌측: 텍스트 영역 */}
            <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center rounded-full border border-[#f0efe6] px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
                AI Agent 채용
              </span>

              <h1 className="mt-4 text-[4rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[5rem]">
                코비가 채용의 모든 과정을 자동화합니다.
              </h1>

              <p className="mt-6 w-full text-[18px] font-normal leading-[1.5] tracking-normal text-[#5f6363] md:text-[20px]">
                슈퍼코더 AI Interviewer 는 채용공고 분석부터 역량 추출, 실시간
                AI 면접, 평가 리포트까지 한 번에 처리하는 풀스택 채용 자동화
                플랫폼입니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href="/contact"
                  data-track="cta_hero_contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  도입 문의하기
                </Link>
                <Link
                  href="/download"
                  data-track="cta_hero_download"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
                >
                  소개서 다운로드
                </Link>
              </div>
            </div>

            <div className="flex w-full items-start lg:pt-4">
              <HeroVisual />
            </div>
          </div>

          <LogoMarquee />
        </div>
      </header>
      </SectionTracker>

      <SectionTracker id="pain_points"><PainPoints /></SectionTracker>
      <SectionTracker id="solution_bridge"><SolutionBridge /></SectionTracker>
      <SectionTracker id="kobi_intro"><KobiIntro /></SectionTracker>
      <SectionTracker id="core_features"><CoreFeatures /></SectionTracker>
      <SectionTracker id="how_it_works"><HowItWorks /></SectionTracker>
      <SectionTracker id="ai_service_detail"><AiServiceDetail /></SectionTracker>
      <SectionTracker id="candidate_experience"><CandidateExperience /></SectionTracker>
      <SectionTracker id="metrics"><Metrics /></SectionTracker>
      <SectionTracker id="customer_logos"><CustomerLogos /></SectionTracker>
      <SectionTracker id="security_integration"><SecurityIntegration /></SectionTracker>

      {/* Faqs 는 async server component — SectionTracker(client) 로 직접 감쌀 수 없으므로
          Faqs 내부에서 자체 data-section 을 가지고 있음. 아래 div 로 래핑. */}
      <SectionTracker id="faqs"><Faqs /></SectionTracker>

      <SectionTracker id="contact_cta"><ContactCta /></SectionTracker>

      {/* Floating CTA — 모바일 전용 고정 CTA 바 */}
      <FloatingCta />
    </>
  );
}
