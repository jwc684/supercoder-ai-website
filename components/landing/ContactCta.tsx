import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

/**
 * ContactCta — v3 narrative 의 "Final CTA" 섹션.
 * 가운데 정렬 gradient 박스, 4 feature checks, 2 CTA.
 */

const features = [
  "1영업일 내 컨택",
  "30일 무료 체험",
  "온보딩 지원 포함",
  "ISO 27001 보안 인증",
];

export function ContactCta() {
  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="mx-auto max-w-[720px] rounded-3xl border border-[var(--color-primary)]/20 bg-gradient-to-br from-[var(--color-primary-light)]/50 via-white to-[#e8f1ff]/40 px-6 py-14 text-center md:px-12 md:py-16">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
            지금 시작하기
          </span>

          <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.25rem]">
            직감 대신 데이터로,
            <br />
            지금 시작하세요
          </h2>

          <p className="mt-4 text-[16px] leading-[1.7] text-[#5f6363]">
            이력서 검증부터 역량 면접, 평가 리포트까지. 채용팀의 판단이
            데이터로 단단해집니다.
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-1.5 text-[13px] text-[#5f6363]"
              >
                <Check
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
                  strokeWidth={2.5}
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              data-track="cta_final_contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              무료 데모 신청하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/download"
              data-track="cta_final_download"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
            >
              소개서 다운로드
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
