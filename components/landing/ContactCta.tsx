import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * ContactCta — v3 narrative 의 "Final CTA" 섹션.
 * 왼쪽 Title · 오른쪽 2 CTA (다크 테마, flex.team 스타일 미니멀).
 */

export function ContactCta() {
  return (
    <div className="bg-[#0a0a0a] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center md:gap-16">
          <h2 className="max-w-xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[2.5rem] lg:text-[3rem]">
            직감 대신 데이터로,
            <br />
            지금 시작하세요
          </h2>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/contact"
              data-track="cta_final_contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold leading-[1.5] text-[#0a0a0a] transition-colors hover:bg-white/90"
            >
              무료 데모 신청하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/download"
              data-track="cta_final_download"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] transition-colors hover:bg-white/5 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]"
            >
              소개서 다운로드
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
