/**
 * Hero 우측 시각 영역 — 5 단계 프로세스 시퀀셜 애니메이션.
 * 레이아웃: 고정 폭의 배지 컬럼(72px) + 카드 컬럼(flex-1).
 * 라인은 배지 컬럼 가운데(36px)에 z-0 으로 배경 렌더링되고,
 * 배지는 z-10 + ring-white 로 라인을 가리며 시각적 포인트가 된다.
 */
const steps = [
  {
    id: 1,
    label: "채용공고 분석",
    sub: "JD 에서 핵심 역량 자동 추출",
    icon: "📄",
  },
  { id: 2, label: "역량 추출", sub: "Hard / Soft Skills 가중치", icon: "🎯" },
  { id: 3, label: "질문 추천", sub: "STAR / 상황 / 기술 검증", icon: "💡" },
  { id: 4, label: "AI 면접", sub: "실시간 Deep Dive 꼬리질문", icon: "🎤" },
  { id: 5, label: "AI 보고서", sub: "역량별 점수 + 리스크 분석", icon: "📊" },
];

const STEP_COUNT = steps.length;

export function HeroVisual() {
  return (
    // Stacked 모드: 480px 캡 + mx-auto 로 가운데 정렬, 자연 높이
    // 데스크톱(≥lg): aspect-square 복원, max-w 해제, justify-between 으로 셀 가득 분포
    <div className="hero-visual relative mx-auto w-full max-w-[480px] lg:max-w-none lg:aspect-square">
      {/* 배경 방사형 글로우 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-gradient-radial from-[var(--color-primary-light)] to-transparent opacity-60 blur-3xl"
      />

      {/* 스텝 스택 — stacked: 자연 높이 + gap-5(20px), 데스크톱: h-full + justify-between */}
      <ul className="relative flex flex-col gap-5 py-2 lg:h-full lg:justify-between lg:gap-0">
        {/* 배경 점선 세로 라인: 배지 컬럼 정중앙(left 36 − width 2 /2 = 35) */}
        <span
          aria-hidden
          className="hv-line pointer-events-none absolute left-[35px] top-[calc(0.5rem+36px)] bottom-[calc(0.5rem+36px)] z-0 w-[2px]"
        />

        {/* 진행 dot: 스텝 간을 이동 */}
        <span
          aria-hidden
          className="hv-dot pointer-events-none absolute left-[31px] z-[5] h-[10px] w-[10px] rounded-full bg-[var(--color-primary)] shadow-[0_0_0_4px_rgba(37,99,235,0.18)]"
          style={
            {
              "--step-count": STEP_COUNT,
            } as React.CSSProperties
          }
        />

        {steps.map((step, i) => (
          <li
            key={step.id}
            className="hv-step relative flex items-center gap-5"
            style={{ "--step-index": i } as React.CSSProperties}
          >
            {/* 배지 (고정 72px) */}
            <div
              aria-hidden
              className="hv-step-badge relative z-10 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3A6FFF] to-[#2144A5] text-3xl shadow-lg ring-4 ring-white"
            >
              {step.icon}
            </div>
            {/* 카드 */}
            <div className="hv-step-card min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[10px] font-bold text-[var(--color-primary)]">
                  {step.id}
                </span>
                <p className="text-[15px] font-semibold text-[#282828]">
                  {step.label}
                </p>
              </div>
              <p className="mt-1 text-xs text-[#5f6363]">{step.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
