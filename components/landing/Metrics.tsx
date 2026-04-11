import { TrendingDown, TrendingUp, PiggyBank } from "lucide-react";

/**
 * Metrics — 기획문서 3.1 Section 9: "성과 데이터 (60일→2일, 5배 합격률, 90% 비용 절감)"
 */

type Metric = {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  unit: string;
  label: string;
  desc: string;
};

const metrics: Metric[] = [
  {
    icon: TrendingDown,
    value: "60일",
    unit: "→ 2일",
    label: "채용 기간 단축",
    desc: "평균 채용 기간을 60일에서 2일로 대폭 축소",
  },
  {
    icon: TrendingUp,
    value: "5×",
    unit: "배",
    label: "합격률 상승",
    desc: "1차 면접 통과자 중 최종 합격 비율이 5배 증가",
  },
  {
    icon: PiggyBank,
    value: "90%",
    unit: "절감",
    label: "비용 절감",
    desc: "외부 헤드헌팅·면접관 인건비 대비 90% 비용 절감",
  },
];

export function Metrics() {
  return (
    <div className="bg-[#0b1b4a] py-20 md:py-28 lg:py-32">
      {/* 어두운 브랜드 블루 배경으로 큰 숫자 강조 */}
      <div className="wp-container">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-white/80">
            Proven Results
          </span>

          <h2 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-white md:text-[3.5rem]">
            숫자로 증명된 채용 혁신
          </h2>

          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-white/70 md:text-[20px]">
            시간 · 품질 · 비용, 세 가지 지표에서 모두 측정 가능한 변화를
            만듭니다.
          </p>
        </div>

        {/* 3-column big metric cards */}
        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-8">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="relative overflow-hidden rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.07] md:p-10"
              >
                {/* 배경 글로우 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#3A6FFF]/20 blur-3xl"
                />

                <div className="relative flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#89b0ff]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    {m.label}
                  </p>
                </div>

                <div className="relative mt-8 flex items-baseline gap-2">
                  <span className="text-[64px] font-bold leading-none tracking-tight text-white md:text-[72px]">
                    {m.value}
                  </span>
                  <span className="text-[18px] font-medium text-white/70 md:text-[20px]">
                    {m.unit}
                  </span>
                </div>

                <p className="relative mt-4 text-[14px] leading-[1.6] text-white/70 md:text-[15px]">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
