import { Zap, Target, ClipboardList, Quote } from "lucide-react";

/**
 * CLevelPerspective — v3 narrative 의 경영진 관점 섹션.
 * 좌측: 3 cards (속도 / 품질 / 투명성).
 * 우측: 대표이사 인용문 카드 (placeholder author).
 */

type Point = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

const points: Point[] = [
  {
    icon: Zap,
    title: "AX로 채용 속도 단축",
    body: "AI 면접관 도입 자체가 채용 분야 AX의 가장 빠른 시작입니다. 평균 채용 기간을 대폭 줄입니다.",
  },
  {
    icon: Target,
    title: "일관된 기준으로 채용 품질 향상",
    body: "면접관 교육 없이도 모든 면접이 동일한 구조와 기준으로 진행됩니다. 편향 없는 역량 중심 평가입니다.",
  },
  {
    icon: ClipboardList,
    title: "채용 과정의 완전한 투명성",
    body: "모든 면접이 녹화되고 리포트로 남습니다. \"왜 이 사람을 뽑았는가\"를 데이터로 보고할 수 있습니다.",
  },
];

export function CLevelPerspective() {
  return (
    <div className="bg-[var(--color-bg-alt)] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
              경영진 관점
            </span>

            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
              채용팀의 노력이
              <br />
              성과로 이어지려면
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-[1.7] text-[#5f6363]">
              면접관이 훈련 없이 면접을 진행하고, HR이 직무를 모른 채
              평가합니다. 채용 품질의 문제는 사람이 아니라 구조입니다.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {points.map((pt) => {
                const Icon = pt.icon;
                return (
                  <li
                    key={pt.title}
                    className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold leading-[1.4] text-[#282828]">
                        {pt.title}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] leading-[1.65] text-[#5f6363]">
                        {pt.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quote card — 실제 경영진 인터뷰로 교체 */}
          <figure className="relative rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm md:p-10">
            <Quote
              aria-hidden
              className="absolute left-6 top-6 h-12 w-12 text-[var(--color-primary-light)]"
              strokeWidth={1.5}
            />
            <blockquote className="relative pt-10 text-[16px] leading-[1.85] text-[#282828] md:text-[17px]">
              채용팀이 바쁜 건 알았지만, 왜 사람을 자꾸 잘못 뽑는지는 몰랐습니다.
              AI 리포트를 보고 나서야 면접 과정 자체에 구조가 없었다는 걸 알게
              됐어요. 이제 경영진이 채용 결과를 신뢰할 수 있게 됐습니다.
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[13px] font-bold text-[var(--color-primary)]">
                대
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#282828]">
                  ○○○ 대표
                </p>
                <p className="text-[12px] text-[#9099a3]">
                  [고객사명 교체] — 대표이사
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
