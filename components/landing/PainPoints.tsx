import { Search, Clock3, ClipboardList, Check } from "lucide-react";

/**
 * PainPoints — v3 narrative 의 "Problem" 섹션.
 * 3-bucket 구조: 검증 / 효율 / 투명성.
 * 각 버킷 = 태그 · 제목 · 3 개 pain · divider · ✓ 답변.
 */

type Bucket = {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  tagAccent: "blue" | "indigo" | "emerald";
  title: string;
  pains: string[];
  answer: string;
};

const buckets: Bucket[] = [
  {
    icon: Search,
    tag: "검증의 문제",
    tagAccent: "blue",
    title: "\"무엇을 기준으로 누구를 뽑아야 할지 모르겠다\"",
    pains: [
      "이력서가 사실인지 확인할 방법이 없다",
      "직무마다 \"좋은 사람\"의 기준이 달라서 혼자 정하기 어렵다",
      "HR이 개발자, 디자이너, 세일즈 직무를 전부 알 수는 없다",
    ],
    answer: "AI가 JD를 읽고 직무 역량을 자동 추출합니다. HR이 직무를 몰라도 됩니다.",
  },
  {
    icon: Clock3,
    tag: "효율의 문제",
    tagAccent: "indigo",
    title: "\"채용 한 건에 너무 많은 시간과 사람이 들어간다\"",
    pains: [
      "면접 일정 조율, 진행, 평가 취합까지 전부 수작업",
      "현업 팀장들에게 면접 잘 보는 법을 가르쳐야 하는데 방법도 모르겠다",
      "면접관 교육을 위한 시간도, 방법도 없다",
    ],
    answer: "AI가 1차 면접 전체를 자동 진행합니다. 면접관 교육이 필요 없습니다.",
  },
  {
    icon: ClipboardList,
    tag: "투명성의 문제",
    tagAccent: "emerald",
    title: "\"경영진은 더 높은 기준을 요구하는데 방법이 없다\"",
    pains: [
      "채용 과정이 블랙박스다 — 왜 이 사람을 뽑았는지 설명이 안 된다",
      "AX 도입으로 채용 속도·품질을 동시에 높이라는 압박이 있다",
      "면접 결과가 기억과 메모에만 남는다",
    ],
    answer: "모든 면접이 녹화·리포트화되어 근거 기반 보고가 가능합니다.",
  },
];

const TAG_STYLES: Record<Bucket["tagAccent"], string> = {
  blue: "bg-[#e8f1ff] text-[#2563eb]",
  indigo: "bg-[#eef0ff] text-[#4338ca]",
  emerald: "bg-[#e6f6ee] text-[#047857]",
};

export function PainPoints() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="flex flex-col items-start text-left">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
            채용팀의 현실
          </span>

          <h2 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
            직감에 의존할 수밖에 없었던
            <br />
            세 가지 이유
          </h2>

          <p className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-[#5f6363]">
            기준도, 데이터도, 시간도 없었으니까요. 채용팀이 지쳐있는 건 당연한
            일입니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {buckets.map((bucket) => {
            const Icon = bucket.icon;
            return (
              <article
                key={bucket.tag}
                className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-7 md:p-8"
              >
                <div
                  className={`inline-flex w-fit items-center gap-2 rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${TAG_STYLES[bucket.tagAccent]}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {bucket.tag}
                </div>

                <h3 className="mt-5 text-[19px] font-semibold leading-[1.4] text-[#282828]">
                  {bucket.title}
                </h3>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {bucket.pains.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-[13.5px] leading-[1.6] text-[#5f6363]"
                    >
                      <span aria-hidden className="mt-[9px] h-[1.5px] w-2 shrink-0 bg-[#9099a3]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div
                  aria-hidden
                  className="my-5 h-px bg-[var(--color-border)]"
                />

                <p className="flex items-start gap-2 text-[13.5px] font-medium leading-[1.6] text-[var(--color-success)]">
                  <Check className="mt-[2px] h-4 w-4 shrink-0" />
                  <span>{bucket.answer}</span>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
