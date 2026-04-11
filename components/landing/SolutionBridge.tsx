import { ArrowRight, FileText, Sparkles, ClipboardCheck } from "lucide-react";

/**
 * SolutionBridge — PainPoints 와 KobiIntro 사이의 전환 섹션.
 * 기획문서 3.1 Section 3: "채용공고 하나로, 면접 설계부터 평가까지"
 *
 * 구조:
 *   <div> (sibling of hero <header>, section 태그 없음)
 *     <div className="wp-container">
 *       <div>eyebrow + h2 + body</div>
 *       <div>flow 다이어그램 [input → kobi → output]</div>
 */

type FlowStep = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
};

const flowSteps: FlowStep[] = [
  {
    icon: FileText,
    label: "채용공고 입력",
    sub: "직무 기술서 한 장",
  },
  {
    icon: Sparkles,
    label: "코비가 처리",
    sub: "역량 · 질문 · 면접 · 리포트",
  },
  {
    icon: ClipboardCheck,
    label: "평가 완료",
    sub: "근거 기반 의사결정",
  },
];

export function SolutionBridge() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        {/* 상단 헤더 영역 */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow pill — Maki .g_label */}
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            SOLUTION
          </span>

          {/* H2 — Maki title-l 스케일 (2.5rem mobile → 3.5rem desktop)
              font-weight 500, line-height 110%, color #282828 */}
          <h2 className="mt-4 max-w-4xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
            채용공고 하나로, 면접 설계부터 평가까지
          </h2>

          {/* Body paragraph */}
          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            역량 추출 · 질문 추천 · 실시간 면접 · 평가 리포트. 모든 단계를
            코비가 자동으로 연결합니다.
          </p>
        </div>

        {/* Flow 다이어그램 — 3 stages with arrows between */}
        <div className="mt-14 flex flex-col items-stretch gap-4 md:mt-20 md:flex-row md:items-center md:justify-center md:gap-2">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === flowSteps.length - 1;
            return (
              <div
                key={step.label}
                className="flex flex-col items-center gap-4 md:flex-row md:gap-2"
              >
                {/* 스텝 카드 */}
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-6 py-5 text-center md:w-[220px] md:px-4 lg:w-[240px]">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-[16px] font-semibold text-[#282828]">
                    {step.label}
                  </p>
                  <p className="text-[13px] leading-[1.5] text-[#5f6363]">
                    {step.sub}
                  </p>
                </div>

                {/* 화살표 — 마지막 스텝 뒤에는 없음 */}
                {!isLast && (
                  <ArrowRight
                    aria-hidden
                    className="h-5 w-5 shrink-0 rotate-90 text-[var(--color-text-sub)] md:rotate-0"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
