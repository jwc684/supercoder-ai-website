import type { Metadata } from "next";
import Link from "next/link";
import { getStaticPageMeta } from "@/lib/seo";
import { SectionTracker } from "@/components/analytics/SectionTracker";
import { AnomalousMatterHero } from "@/components/ui/anomalous-matter-hero";
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
        <AnomalousMatterHero
          eyebrow="AI 채용 면접 자동화"
          title={
            <>
              좋은 인재,
              <br />
              <span className="text-white">직감 말고 데이터로</span>
            </>
          }
          description={
            <>
              이력서 검증부터 역량 면접, 평가 리포트까지.
              <br />
              채용팀의 판단이 데이터로 단단해집니다.
            </>
          }
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              data-track="cta_hero_contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-10 py-5 text-lg font-semibold leading-[1.5] text-[#2144A5] transition-colors hover:bg-white/90 md:text-xl"
            >
              무료 데모 신청하기 →
            </Link>
            <Link
              href="/download"
              data-track="cta_hero_download"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-10 py-5 text-lg font-semibold leading-[1.5] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-colors hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.85)] md:text-xl"
            >
              소개서 다운로드
            </Link>
          </div>
          <p className="mt-5 text-sm text-white md:text-base">
            1영업일 내 컨택 · 30일 무료 체험 · 별도 설치 없음
          </p>
        </AnomalousMatterHero>
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
