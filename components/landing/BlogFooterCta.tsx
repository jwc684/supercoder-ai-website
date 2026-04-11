import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * BlogFooterCta — 블로그 목록/상세 페이지 하단 공통 CTA 섹션.
 * Maki .c_footer_cta 구조 매칭:
 *   section → g_page--container → c_footer_cta
 * 즉, CTA 는 full-bleed 가 아니라 컨텐츠 컨테이너 안에 들어간다. 본 컴포넌트는
 * 그 c_footer_cta 블록을 main blue 카드로 렌더해서 블로그 컨텐츠와 동일한 너비로
 * 유지한다.
 *
 * 구조:
 *   wp-container
 *     └ blue rounded card (c_footer_cta 위치)
 *         ├ c_footer_cta--content  (centered heading + 2 CTA buttons)
 *         └ c_footer_cta--social_proof (4 stat cards, divider top)
 */

const stats = [
  { value: "60일 → 2일", label: "채용 기간 단축" },
  { value: "5×", label: "합격률 상승" },
  { value: "90%", label: "비용 절감" },
  { value: "95%", label: "지원자 만족도" },
];

export function BlogFooterCta() {
  return (
    <div className="wp-container mt-20 pb-20 md:mt-24 md:pb-28">
      <div className="overflow-hidden rounded-2xl bg-[var(--color-primary)] px-6 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
        {/* c_footer_cta--content : centered heading + buttons */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-[2rem] font-medium leading-[1.1] text-white md:text-[3rem]">
            코비와 함께 채용을 혁신하세요
          </h2>
          <p className="mt-5 text-[16px] leading-[1.55] text-white/80 md:text-[18px]">
            1 영업일 내 맞춤 데모 제안 · 무료 체험 30일 · 기업 보안 검토 완료
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

        {/* c_footer_cta--social_proof : 4 stat cards with top divider */}
        <div className="mt-14 grid grid-cols-2 gap-6 border-t border-white/20 pt-12 md:mt-16 md:grid-cols-4 md:gap-8 md:pt-14">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <p className="text-[1.75rem] font-semibold leading-[1.1] text-white md:text-[2.25rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[13px] font-normal leading-[1.45] text-white/75 md:text-[14px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
