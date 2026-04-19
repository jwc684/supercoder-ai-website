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
              도입 효과
            </span>

            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
              채용이 빨라지고, 정확해지고, 비용은 줄어듭니다
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-[1.7] text-[#5f6363]">
              1차 면접을 AI가 자동으로 진행합니다. HR 팀은 결과 검토에만
              집중하고, 채용 속도·정확도·비용이 동시에 개선됩니다.
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
              AI 면접을 도입한 뒤로는 1차 면접이 자동으로 진행되니, 저희 시간은
              최종 후보 검토와 조직 핏 판단에만 쓰고 있습니다. 채용 검증
              기간은 2–3개월에서 1–2주로 줄었고, 1인당 채용 비용도 AI 면접
              덕분에 수천만 원 가까이 아낄 수 있게 됐습니다. 무엇보다 합격자의
              업무 적합도가 체감될 만큼 올라갔습니다.
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[13px] font-bold text-[var(--color-primary)]">
                김
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#282828]">
                  ○○○ HR 총괄
                </p>
                <p className="text-[12px] text-[#9099a3]">
                  [고객사명 교체] — 인공지능 인테리어 디자인 솔루션 회사
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
