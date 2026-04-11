import { CheckCircle2, Rocket } from "lucide-react";

/**
 * HowItWorks — 기획문서 3.1 Section 6: "작동 방식 (5스텝 타임라인, 셋업 10분)"
 *
 * 5 스텝:
 *   1. 채용공고 업로드
 *   2. 역량 · 질문 검토
 *   3. 지원자에게 링크 발송
 *   4. 코비와 면접 진행
 *   5. 리포트 확인 · 최종 결정
 */

type Step = {
  num: number;
  title: string;
  desc: string;
  time: string;
};

const steps: Step[] = [
  {
    num: 1,
    title: "채용공고 업로드",
    desc: "JD 텍스트를 붙여넣거나 PDF 파일을 드래그하면 끝.",
    time: "1 분",
  },
  {
    num: 2,
    title: "역량 · 질문 검토",
    desc: "코비가 뽑은 역량과 추천 질문을 검토하고 가중치를 조정합니다.",
    time: "3 분",
  },
  {
    num: 3,
    title: "지원자 초대",
    desc: "링크를 지원자에게 발송. 로그인 없이 면접 가능.",
    time: "1 분",
  },
  {
    num: 4,
    title: "코비가 면접 진행",
    desc: "지원자가 편한 시간에 코비와 대화. HR 팀은 관여하지 않아도 됩니다.",
    time: "실시간",
  },
  {
    num: 5,
    title: "리포트 확인",
    desc: "역량별 점수 · 근거 인용 · 리스크까지 한눈에. 2차 면접 대상 선정.",
    time: "5 분",
  },
];

export function HowItWorks() {
  return (
    <div className="bg-[#eff4ff] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            How it works
          </span>

          <h2 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
            셋업 10분, 그 다음은 코비가 알아서
          </h2>

          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            채용공고만 넣으면 면접 설계부터 평가까지 코비가 모두 처리합니다.
            HR 팀은 최종 결정에만 집중하세요.
          </p>

          {/* 셋업 시간 하이라이트 배지 */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-white px-4 py-2 shadow-sm">
            <Rocket className="h-4 w-4 text-[var(--color-primary)]" />
            <span className="text-[13px] font-semibold text-[#282828]">
              전체 셋업 시간 <span className="text-[var(--color-primary)]">10분</span>
            </span>
          </div>
        </div>

        {/* Timeline — horizontal 데스크톱 / vertical 모바일 */}
        <div className="mt-14 md:mt-20">
          {/* Desktop: 5열 수평 타임라인 */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* 가로 배경 라인 (첫 원 중심 → 마지막 원 중심) */}
              <div
                aria-hidden
                className="absolute left-[10%] right-[10%] top-6 h-[2px] bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)]/40 to-[var(--color-primary)]/20"
              />

              <ol className="relative grid grid-cols-5 gap-4">
                {steps.map((step) => (
                  <li
                    key={step.num}
                    className="flex flex-col items-center text-center"
                  >
                    {/* 원형 마커 */}
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg ring-4 ring-[#eff4ff]">
                      <span className="text-[15px] font-bold">{step.num}</span>
                    </div>
                    {/* 카드 */}
                    <div className="mt-5 w-full rounded-2xl border border-[var(--color-border)] bg-white p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                        {step.time}
                      </p>
                      <p className="mt-2 text-[16px] font-semibold text-[#282828]">
                        {step.title}
                      </p>
                      <p className="mt-2 text-[12.5px] leading-[1.55] text-[#5f6363]">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Mobile/Tablet: 세로 타임라인 */}
          <ol className="relative flex flex-col gap-6 lg:hidden">
            {/* 세로 배경 라인 */}
            <div
              aria-hidden
              className="absolute bottom-6 left-6 top-6 w-[2px] bg-gradient-to-b from-[var(--color-primary)]/30 to-[var(--color-primary)]/10"
            />
            {steps.map((step) => (
              <li key={step.num} className="relative flex items-start gap-4">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg ring-4 ring-[#eff4ff]">
                  <span className="text-[15px] font-bold">{step.num}</span>
                </div>
                <div className="flex-1 rounded-2xl border border-[var(--color-border)] bg-white p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[16px] font-semibold text-[#282828]">
                      {step.title}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                      {step.time}
                    </p>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.55] text-[#5f6363]">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 마무리 배지 */}
        <div className="mt-12 flex items-center justify-center gap-2 text-[13px] text-[#5f6363] md:mt-16">
          <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
          <span>
            모든 단계에서 HR 팀이 개입하거나 자동 진행할 수 있습니다.
          </span>
        </div>
      </div>
    </div>
  );
}
