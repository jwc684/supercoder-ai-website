/**
 * Hero 우측 시각 영역 — 5 단계 프로세스 시퀀셜 애니메이션.
 * 레이아웃: 고정 폭의 배지 컬럼(72px) + 카드 컬럼(flex-1).
 * 라인은 배지 컬럼 가운데(36px)에 z-0 으로 배경 렌더링되고,
 * 배지는 z-10 + ring-white 로 라인을 가리며 시각적 포인트가 된다.
 */
const steps = [
  {
    id: 1,
    label: "채용공고 업로드",
    sub: "JD 텍스트 또는 PDF 붙여넣기",
    icon: "📄",
  },
  {
    id: 2,
    label: "역량 자동 추출",
    sub: "AI가 직무 역량 · 가중치 · 질문 생성",
    icon: "🎯",
  },
  {
    id: 3,
    label: "지원자 링크 발송",
    sub: "앱 설치 없이 링크만으로 참여",
    icon: "📨",
  },
  {
    id: 4,
    label: "AI 면접 자동 진행",
    sub: "음성 대화 · 실시간 꼬리 질문 · 다국어",
    icon: "🎤",
  },
  {
    id: 5,
    label: "평가 리포트",
    sub: "역량별 점수 · 근거 인용 · 경영진 공유",
    icon: "📊",
  },
];

const STEP_COUNT = steps.length;

export function HeroVisual() {
  return (
    // Stacked 모드: 480px 캡 + mx-auto 로 가운데 정렬, 자연 높이
    // 데스크톱(≥lg): aspect-square 복원, max-w 해제, justify-between 으로 셀 가득 분포
    //
    // isolate: 새로운 stacking context 생성 — -z-10 글로우가 외부 레이어 간섭 없이 뒤로 감.
    // overflow-x 측 누출 방지: 모바일에서 -inset-10 글로우가 body.scrollWidth 를 늘리던
    // 이슈 (375px viewport 에서 +20px overflow) 를 차단.
    <div className="hero-visual relative isolate mx-auto w-full max-w-[480px] overflow-x-hidden lg:max-w-none lg:aspect-square lg:overflow-x-visible">
      {/* 배경 방사형 글로우 — -inset-10 로 부모를 40px 확장. 모바일에선 overflow-x-hidden 으로 클립 */}
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
