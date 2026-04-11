/**
 * Hero 우측 시각 영역 — makipeople.com 의 agent-card 컨셉 차용.
 * 순수 SVG + CSS 애니메이션으로 구현 (Lottie 의존성 없음).
 */
export function HeroVisual() {
  return (
    <div className="hero-visual relative aspect-square w-full max-w-[521px]">
      {/* 중앙 아바타 플레이스홀더 (코비) */}
      <div className="hv-avatar absolute left-1/2 top-[8%] -translate-x-1/2">
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#3A6FFF] to-[#2144A5] shadow-xl ring-4 ring-white md:h-40 md:w-40">
          <svg
            viewBox="0 0 113 61"
            className="h-16 w-16 md:h-20 md:w-20"
            aria-hidden
          >
            <path
              d="M68.4287 2.31816L73.1402 8.18866L73.9968 9.24686L74.6519 10.0531C73.9968 10.809 73.4677 11.7412 72.989 12.6734L55.3019 57.6722C54.3697 59.5618 52.6312 60.7208 50.7416 60.746H49.4314C47.0883 60.746 45.2742 59.6122 43.6869 57.6218L39.7816 52.7339L38.8242 51.5245C39.2525 50.945 39.6053 50.2647 39.958 49.6097L57.9978 3.82988C58.9804 1.81425 60.8701 0.378124 62.8353 0.0253906H64.0195C64.0195 0.0253906 66.4634 0.277343 68.4287 2.31816Z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M91.1296 3.12421C89.5423 1.15898 87.3 0 84.9568 0H65.0273C64.6998 0 64.3471 0 64.0195 0C65.6572 0.226757 67.4461 1.15898 68.4287 2.29277L73.1402 8.16327L73.9969 9.22147L74.6519 10.0277L90.9281 30.3603L73.1402 52.7337L72.3592 53.7415L68.2775 58.7806C67.3201 59.9647 65.9848 60.6954 64.5738 60.6954H86.5945C88.0054 60.6954 89.366 60.0151 90.3234 58.8057L112.974 30.3099L91.1296 3.12421Z"
              fill="white"
            />
            <path
              d="M43.6634 57.6216L39.7581 52.7337L38.8007 51.5243L24.515 33.5601L22.0207 30.4107L43.865 3.12421L44.8476 1.91484C45.805 0.730663 47.1403 0 48.5513 0H26.5306C25.1197 0 23.7843 0.680272 22.8269 1.86445L0 30.3351L21.6427 57.5712C23.23 59.5616 25.4724 60.6954 27.8408 60.6954H49.4079C47.0648 60.6954 45.2507 59.5868 43.6634 57.5712V57.6216Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* 연결선 SVG — 아바타 → 2 카드 */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 521 521"
        fill="none"
        aria-hidden
      >
        <path
          d="M260 180 Q 260 260 390 280"
          stroke="#E5E7EB"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="hv-path hv-path-1"
        />
        <path
          d="M260 180 Q 260 340 390 380"
          stroke="#E5E7EB"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="hv-path hv-path-2"
        />
      </svg>

      {/* 우측 카드 1 — Screening Agent */}
      <div className="hv-card hv-card-1 absolute right-[2%] top-[48%] w-[56%] max-w-[260px] rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-lg">
        <p className="text-xs font-medium text-[var(--color-text-sub)]">
          Screening Agent
        </p>
        <p className="mt-1 text-[15px] font-semibold text-[var(--color-text)]">
          코비 (Kobi)
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-md bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
            채용공고 분석
          </span>
          <span className="inline-flex items-center rounded-md bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
            역량 추출
          </span>
        </div>
      </div>

      {/* 우측 카드 2 — Interview Agent */}
      <div className="hv-card hv-card-2 absolute right-[2%] top-[72%] w-[56%] max-w-[260px] rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-lg">
        <p className="text-xs font-medium text-[var(--color-text-sub)]">
          Interview Agent
        </p>
        <p className="mt-1 text-[15px] font-semibold text-[var(--color-text)]">
          코비 (Kobi)
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            실시간 Deep Dive
          </span>
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            리포트
          </span>
        </div>
      </div>

      {/* 배경 장식 원 */}
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-gradient-radial from-[var(--color-primary-light)] to-transparent opacity-60 blur-3xl" />
    </div>
  );
}
