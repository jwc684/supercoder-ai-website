import { Scale, Globe2, Smartphone } from "lucide-react";

/**
 * CandidateExperience — 기획문서 3.1 Section 8:
 * "지원자 경험 (공정한 면접 · 다국어 · 멀티 디바이스)"
 */

type Experience = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

const experiences: Experience[] = [
  {
    icon: Scale,
    title: "공정한 면접",
    desc: "구조화된 동일 질문 · 근거 기반 평가 · 면접관 편향 없는 일관성.",
  },
  {
    icon: Globe2,
    title: "4개 언어 지원",
    desc: "한국어 · 영어 · 베트남어 · 아랍어로 모국어 면접 경험.",
  },
  {
    icon: Smartphone,
    title: "언제 어디서나",
    desc: "데스크톱 · 태블릿 · 모바일 어디서든 브라우저로 바로 참여.",
  },
];

export function CandidateExperience() {
  return (
    <div className="bg-[#eff4ff] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Left: Text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              Candidate Experience
            </span>

            <h2 className="mt-4 text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
              지원자에게도 좋은 면접
            </h2>

            <p className="mt-5 max-w-xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
              편한 시간에, 편한 디바이스로, 편한 언어로. 코비는 지원자를
              존중하는 톤으로 대화합니다.
            </p>

            {/* 지원자 인용 */}
            <blockquote className="mt-8 max-w-xl rounded-2xl border border-[var(--color-border)] bg-white p-6 text-left shadow-sm">
              <p className="text-[15px] leading-[1.6] text-[#282828]">
                “점심 시간에 모바일로 면접을 봤어요. 코비가 생각보다 편하게
                대화를 이끌어줘서 긴장을 덜 수 있었습니다.”
              </p>
              <footer className="mt-3 flex items-center gap-2 text-[12px] text-[#5f6363]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[10px] font-bold text-[var(--color-primary)]">
                  K
                </span>
                <span>김 아무개 · 백엔드 지원자</span>
              </footer>
            </blockquote>
          </div>

          {/* Right: 3 experience cards (stacked) */}
          <ul className="flex w-full flex-col gap-4">
            {experiences.map((exp) => {
              const Icon = exp.icon;
              return (
                <li
                  key={exp.title}
                  className="flex items-start gap-5 rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-colors hover:border-[var(--color-primary)]/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[17px] font-semibold text-[#282828]">
                      {exp.title}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-[1.55] text-[#5f6363]">
                      {exp.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
