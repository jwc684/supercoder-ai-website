import { Search, Clock3, ClipboardList } from "lucide-react";

/**
 * PainPoints — v3 narrative 의 "Problem" 섹션.
 * 3-bucket 구조: 검증 / 효율 / 투명성.
 * 각 카드 = 컬러 배지 아이콘 + 태그 + 타이틀 + 설명.
 * 솔루션은 다음 섹션(SolutionBridge)에서 제시 — 이 섹션은 문제 정의에만 집중.
 */

type Bucket = {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  tagAccent: "blue" | "indigo" | "emerald";
  title: string;
  description: string;
};

const buckets: Bucket[] = [
  {
    icon: Search,
    tag: "검증의 문제",
    tagAccent: "blue",
    title: "채용 기준이 사람마다, 직무마다 달라집니다",
    description:
      "이력서가 사실인지 검증할 방법이 없고, \"좋은 사람\"의 기준은 직무마다 다릅니다. HR이 개발·디자인·세일즈 직무를 모두 알고 같은 잣대로 거를 수는 없습니다.",
  },
  {
    icon: Clock3,
    tag: "효율의 문제",
    tagAccent: "indigo",
    title: "채용 한 건에 너무 많은 시간이 사라집니다",
    description:
      "일정 조율부터 진행, 평가 취합까지 전부 수작업입니다. 현업 팀장에게 면접 스킬을 따로 가르칠 시간도 자료도 없어, 면접 품질은 사람에 따라 들쭉날쭉합니다.",
  },
  {
    icon: ClipboardList,
    tag: "투명성의 문제",
    tagAccent: "emerald",
    title: "채용 결정의 근거가 어디에도 남지 않습니다",
    description:
      "누가, 왜 이 사람을 뽑았는지 설명할 데이터가 없습니다. 면접 결과는 면접관의 기억과 메모로만 남고, 경영진이 요구하는 채용 속도·품질을 동시에 입증할 방법이 없습니다.",
  },
];

const ACCENT_BADGE: Record<Bucket["tagAccent"], string> = {
  blue: "bg-[#e8f1ff] text-[#2563eb]",
  indigo: "bg-[#eef0ff] text-[#4338ca]",
  emerald: "bg-[#e6f6ee] text-[#047857]",
};

const ACCENT_TAG: Record<Bucket["tagAccent"], string> = {
  blue: "text-[#2563eb]",
  indigo: "text-[#4338ca]",
  emerald: "text-[#047857]",
};

export function PainPoints() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
            채용팀의 현실
          </span>

          <h2 className="mt-4 max-w-4xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
            좋은 인재를 고르는 일이 점점 어려워집니다
          </h2>

          <p className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-[#5f6363]">
            기준도, 시간도, 근거도 부족한 채 결정만 반복됩니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {buckets.map((bucket) => {
            const Icon = bucket.icon;
            return (
              <article
                key={bucket.tag}
                className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d4dbe5] hover:shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] md:p-8"
              >
                {/* 컬러 배지 안 아이콘 */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ACCENT_BADGE[bucket.tagAccent]}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* 태그 (작은 라벨) */}
                <p
                  className={`mt-6 text-[12px] font-semibold uppercase tracking-[0.1em] ${ACCENT_TAG[bucket.tagAccent]}`}
                >
                  {bucket.tag}
                </p>

                {/* 타이틀 */}
                <h3 className="mt-2 text-[1.25rem] font-semibold leading-[1.35] tracking-[-0.01em] text-[#282828] md:text-[1.375rem]">
                  {bucket.title}
                </h3>

                {/* 설명 */}
                <p className="mt-3 text-[15px] leading-[1.65] text-[#5f6363]">
                  {bucket.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
