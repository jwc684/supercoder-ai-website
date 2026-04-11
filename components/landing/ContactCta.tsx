import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

/**
 * ContactCta — 기획문서 3.1 Section 12: "도입 문의 CTA (폼 preview + 데모 신청)"
 * 실제 폼은 /contact 페이지. 이 섹션은 최종 CTA + 간소 폼 preview + 핵심 약속.
 */

const bullets = [
  "1 영업일 내 맞춤 데모 제안",
  "무료 체험 30일 + 온보딩 지원",
  "ISO 27001 인증 · 기업 보안 검토 완료",
];

export function ContactCta() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        {/* 그라디언트 큰 CTA 카드 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A6FFF] via-[#2563eb] to-[#1e3a8a] px-6 py-14 text-white md:px-12 md:py-20 lg:px-16 lg:py-24">
          {/* 배경 장식 */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#3A6FFF]/30 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            {/* Left: 메인 카피 + bullets */}
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-white/90 backdrop-blur-sm">
                Get Started
              </span>

              <h2 className="mt-4 text-[2.5rem] font-medium leading-[105%] tracking-normal text-white md:text-[3.25rem]">
                코비가 귀사의
                <br />
                채용을 바꿉니다
              </h2>

              <p className="mt-5 max-w-xl text-[17px] font-normal leading-[1.55] text-white/85 md:text-[19px]">
                지금 데모를 신청하시면 귀사의 채용 프로세스에 맞춘 맞춤
                시연을 드립니다. 도입 상담은 물론 무료 체험까지 포함됩니다.
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[14.5px] text-white/90"
                  >
                    <CheckCircle2
                      aria-hidden
                      className="mt-[2px] h-5 w-5 shrink-0 text-white"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold leading-[1.5] text-[var(--color-primary)] transition-transform hover:scale-[1.02]"
                >
                  데모 신청하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/download"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-8 py-4 text-base font-semibold leading-[1.5] text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  소개서 받기
                </Link>
              </div>
            </div>

            {/* Right: 미니 폼 preview */}
            <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                    빠른 시작
                  </p>
                  <p className="text-[15px] font-semibold text-white">
                    1 영업일 내 컨택
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <FieldPreview label="회사명" placeholder="예: 슈퍼코더" />
                <FieldPreview label="담당자 이름" placeholder="홍길동" />
                <FieldPreview label="이메일" placeholder="you@company.com" />
                <FieldPreview
                  label="월 평균 채용 규모"
                  placeholder="1~10명 / 11~50명 / …"
                />
              </div>

              <p className="mt-5 text-[11px] leading-[1.5] text-white/60">
                전체 폼은 도입 문의 페이지에서. 제출 정보는 오직 영업팀이
                확인합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldPreview({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-white/60">
        {label}
      </label>
      <div className="mt-1 flex h-10 items-center rounded-md bg-white/5 px-3 text-[13px] text-white/50 ring-1 ring-inset ring-white/15">
        {placeholder}
      </div>
    </div>
  );
}
