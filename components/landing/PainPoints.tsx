import { Clock, Scale, Target } from "lucide-react";

/**
 * PainPoints — Hero 아래 첫 번째 콘텐츠 블록.
 * 기획문서 3.1 Section 2: "HR 담당자의 3가지 고충 (시간, 일관성, 미스매칭)"
 *
 * 구조:
 *   <div> (sibling of hero <header>, 별도 section 태그 없음)
 *     <div className="wp-container">
 *       <div>eyebrow + h2 + body</div>
 *       <div grid>3 cards</div>
 */

type PainPoint = {
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // Tailwind bg class for icon wrapper채용 담당자가 매일 마주하는 3가지 고충

  title: string;
  description: string;
};

const painPoints: PainPoint[] = [
  {
    icon: Clock,
    accent: "bg-[#fff6e5] text-[#b45309]",
    title: "시간",
    description:
      "채용 한 건 당 평균 60일. 면접 일정 조율만 해도 HR 담당자의 일과가 사라집니다.",
  },
  {
    icon: Scale,
    accent: "bg-[#e8f1ff] text-[#2563eb]",
    title: "일관성",
    description:
      "면접관마다 평가 기준이 다르고, 기록은 엑셀에 흩어져 있어 비교가 어렵습니다.",
  },
  {
    icon: Target,
    accent: "bg-[#fef0ef] text-[#dc2626]",
    title: "미스매칭",
    description:
      "스펙 중심의 스크리닝으로 뽑은 인재가 실무에서 맞지 않는 경우가 많습니다.",
  },
];

export function PainPoints() {
  return (
    // 브랜드 블루 계열 light blue 배경 (로고 #3A6FFF / 브랜드 #2563eb 의 톤다운 버전)
    <div className="bg-[#eff4ff] py-16 md:py-24 lg:py-28">
      <div className="wp-container">
        {/* 상단 헤더 영역 (eyebrow + h2 + body) */}
        <div className="flex flex-col items-center text-center">
          {/* Maki .g_label pill */}
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            CHALLENGES
          </span>

          {/* H2 — Maki --font-size--title--l 스케일
              ≥768: 3.5rem (56px) / ≤767: 2.5rem (40px)
              weight 500 / line-height 100% / color #282828 */}
          <h2 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
            채용 담당자가 매일 마주하는 3가지 고충
          </h2>

          {/* Body — body-l 반응형 (18/20) */}
          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            오랜 시간이 걸리고, 기준이 제각각이고, 그래서 또 다시 사람을 잘못
            뽑습니다. 코비가 이 악순환을 끊습니다.
          </p>
        </div>

        {/* 3-card 그리드 */}
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-6 lg:gap-8">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article
                key={point.title}
                className="group flex flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-colors hover:border-[#d4d8de] md:p-8"
              >
                {/* 아이콘 배지 */}
                <div
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${point.accent}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* 카드 타이틀 — title-m 수준 (24px) */}
                <h3 className="text-[24px] font-semibold leading-[130%] text-[#282828]">
                  {point.title}
                </h3>

                {/* 카드 본문 */}
                <p className="text-[16px] font-normal leading-[1.6] text-[#5f6363]">
                  {point.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
