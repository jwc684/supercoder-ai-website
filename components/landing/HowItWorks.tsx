/**
 * HowItWorks — v3 narrative 의 "How It Works" 섹션.
 * 5 스텝 (가로 타임라인 데스크톱 / 세로 타임라인 모바일).
 * 4번째 스텝은 AI 자동 진행 — 강조 스타일.
 */

type Step = {
  num: number | "AI";
  time: string;
  title: string;
  desc: string;
  emphasis?: boolean;
};

const steps: Step[] = [
  {
    num: 1,
    time: "1분",
    title: "채용공고 업로드",
    desc: "JD 텍스트를 붙여넣거나 PDF를 드래그. 로그인 후 바로 시작.",
  },
  {
    num: 2,
    time: "3분",
    title: "역량 · 질문 검토",
    desc: "AI가 추출한 역량과 질문을 검토·조정. 직무 몰라도 됩니다.",
  },
  {
    num: 3,
    time: "1분",
    title: "지원자 초대",
    desc: "링크 발송. 앱 설치 없이 브라우저에서 바로 참여.",
  },
  {
    num: "AI",
    time: "자동 진행",
    title: "AI가 면접 진행",
    desc: "편한 시간에 어떤 기기로든. HR 팀 개입 불필요.",
    emphasis: true,
  },
  {
    num: 5,
    time: "5분",
    title: "리포트 확인",
    desc: "역량 점수·근거·리스크까지. 2차 면접 대상 바로 선정.",
  },
];

export function HowItWorks() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
            사용 방법
          </span>

          <h2 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
            셋업 10분, 그 다음은 AI가 알아서
          </h2>

          <p className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-[#5f6363]">
            채용공고만 넣으면 면접 설계부터 리포트까지. HR 팀 교육이 따로
            필요 없습니다.
          </p>
        </div>

        {/* Desktop: 5-step horizontal timeline */}
        <div className="mt-14 hidden lg:block">
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-[10%] right-[10%] top-[21px] h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent"
            />
            <ol className="relative grid grid-cols-5 gap-4">
              {steps.map((step) => (
                <li key={step.title} className="flex flex-col items-center text-center">
                  <StepCircle step={step} />
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                    {step.time}
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-[#282828]">
                    {step.title}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-[1.55] text-[#5f6363]">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Mobile/Tablet: 2-col grid of cards */}
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
          {steps.map((step) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-5"
            >
              <StepCircle step={step} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                  {step.time}
                </p>
                <p className="mt-1 text-[15px] font-semibold text-[#282828]">
                  {step.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#5f6363]">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function StepCircle({ step }: { step: Step }) {
  const base =
    "relative z-10 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold ring-4 ring-white";
  if (step.emphasis) {
    return (
      <div
        className={`${base} bg-[var(--color-primary)] text-white shadow-lg`}
      >
        {step.num}
      </div>
    );
  }
  return (
    <div
      className={`${base} border-2 border-[var(--color-border)] bg-white text-[var(--color-primary)]`}
    >
      {step.num}
    </div>
  );
}
