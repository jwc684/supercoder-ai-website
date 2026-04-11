import {
  ScanSearch,
  MessagesSquare,
  Mic,
  FileBarChart,
} from "lucide-react";

/**
 * CoreFeatures — 기획문서 3.1 Section 5: "4단계 핵심 기능"
 * 역량 추출 → 질문 설계 → 실시간 면접 → 리포트
 */

type Feature = {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  bullets: string[];
};

const features: Feature[] = [
  {
    step: "01",
    icon: ScanSearch,
    title: "역량 추출",
    desc: "채용공고를 넣으면 코비가 직무에 필요한 역량을 자동으로 뽑아냅니다.",
    bullets: [
      "Hard / Soft Skills 분리",
      "역량별 가중치 제안",
      "업계/직무 벤치마크",
    ],
  },
  {
    step: "02",
    icon: MessagesSquare,
    title: "질문 설계",
    desc: "역량에 맞는 면접 질문을 STAR·상황·기술 유형으로 자동 생성합니다.",
    bullets: [
      "행동 기반(STAR) 질문",
      "상황·기술 검증 질문",
      "난이도/시간 조절",
    ],
  },
  {
    step: "03",
    icon: Mic,
    title: "실시간 면접",
    desc: "코비가 지원자와 음성 대화를 나누며 즉석에서 꼬리 질문을 던집니다.",
    bullets: [
      "음성 대 음성 대화",
      "실시간 Deep Dive",
      "다국어 · 멀티 디바이스",
    ],
  },
  {
    step: "04",
    icon: FileBarChart,
    title: "평가 리포트",
    desc: "역량별 점수, 근거 인용, 부정행위 감지까지 구조화된 리포트로 제공합니다.",
    bullets: [
      "역량별 점수 + 근거",
      "부정행위 리스크 분석",
      "2차 면접용 질문 제안",
    ],
  },
];

export function CoreFeatures() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            Core Features
          </span>

          <h2 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
            채용의 4단계, 전부 자동화
          </h2>

          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            역량을 뽑고, 질문을 설계하고, 면접을 진행하고, 리포트로 끝냅니다.
            코비 하나로 전부.
          </p>
        </div>

        {/* 4-card 그리드 — 2x2 tablet / 1x4 desktop */}
        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <article
                key={feat.step}
                className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-lg md:p-7"
              >
                {/* 배경 Step 숫자 (디자인 장식) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-4 select-none text-[96px] font-bold leading-none text-[var(--color-primary-light)]/50"
                >
                  {feat.step}
                </span>

                {/* Icon + Step label */}
                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                    Step {feat.step}
                  </span>
                </div>

                {/* Title */}
                <h3 className="relative text-[22px] font-semibold leading-[1.25] text-[#282828]">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="relative text-[14px] leading-[1.6] text-[#5f6363]">
                  {feat.desc}
                </p>

                {/* Bullets */}
                <ul className="relative mt-auto flex flex-col gap-1.5 border-t border-[var(--color-border)] pt-4">
                  {feat.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-[12px] text-[#5f6363]"
                    >
                      <span
                        aria-hidden
                        className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
