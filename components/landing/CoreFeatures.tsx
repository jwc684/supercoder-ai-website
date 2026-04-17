import { Target, MessagesSquare, BarChart3, ShieldAlert } from "lucide-react";
import { ThoughtBubble } from "./ThoughtBubble";

/**
 * CoreFeatures — v3 narrative 의 "Features" 섹션.
 * 4 cards (JD×이력서 / Deep Dive / 근거 리포트 / 허위 감지) w/ 'solves' subtitle + pill tags.
 */

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  iconTone: "blue" | "indigo" | "emerald" | "amber";
  title: string;
  solves: string;
  body: string;
  pills: string[];
};

const features: Feature[] = [
  {
    icon: Target,
    iconTone: "blue",
    title: "JD × 이력서 교차 분석",
    solves: "이력서 검증 · 기준 불명확 해결",
    body: "채용공고와 이력서를 동시에 분석해 매칭도 · 강점 · 추가 검증 영역을 즉시 파악합니다. HR이 직무를 몰라도, AI가 기준을 잡아줍니다.",
    pills: ["매칭 점수", "강점·약점 분석", "맞춤 질문 자동 생성"],
  },
  {
    icon: MessagesSquare,
    iconTone: "indigo",
    title: "실시간 Deep Dive 면접",
    solves: "면접 리소스 · 면접관 교육 해결",
    body: "AI가 답변을 들으면서 즉석에서 꼬리 질문을 던집니다. 외운 답변인지, 실제 경험인지 자연스러운 대화로 구별합니다. 면접관 교육이 필요 없습니다.",
    pills: ["음성 대 음성 대화", "실시간 응답 분석", "STAR 구조 검증"],
  },
  {
    icon: BarChart3,
    iconTone: "emerald",
    title: "근거 기반 평가 리포트",
    solves: "투명성 · 경영진 보고 해결",
    body: "역량별 점수, 답변 근거 인용, 영상 타임라인, 2차 면접 추천 질문까지. 주관 없이 데이터로 의사결정하고 경영진에게 바로 공유합니다.",
    pills: ["역량별 점수 + 총점", "영상·스크립트 재생", "2차 면접 질문 제안"],
  },
  {
    icon: ShieldAlert,
    iconTone: "amber",
    title: "이력서 허위 기재 감지",
    solves: "이력서 검증 · 공정성 보장",
    body: "화면 이탈, 다중 인물 감지, 부정행위 리스크까지 자동으로 감지합니다. 이력서 내용과 실제 답변을 교차해 허위 기재 여부를 확인합니다.",
    pills: ["얼굴 인식", "화면·탭 이동 감지", "Low / Mid / High 리스크"],
  },
];

const ICON_BG: Record<Feature["iconTone"], string> = {
  blue: "bg-[#e8f1ff] text-[#2563eb] ring-[#c9dcff]",
  indigo: "bg-[#eef0ff] text-[#4338ca] ring-[#d3d7ff]",
  emerald: "bg-[#e6f6ee] text-[#047857] ring-[#c3ead2]",
  amber: "bg-[#fff4dd] text-[#b45309] ring-[#fadfa2]",
};

export function CoreFeatures() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <ThoughtBubble>
          &ldquo;AI가 면접을 제대로 볼 수 있나? <strong className="not-italic font-semibold text-[#282828]">단순히 질문만 읽어주는 수준</strong> 아닐까?&rdquo;
        </ThoughtBubble>

        <div className="mt-10 flex flex-col items-start text-left md:mt-12">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
            주요 기능
          </span>

          <h2 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
            이력서 검증부터 경영진 보고까지
            <br />
            한 번의 세팅으로
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-7 transition-colors hover:border-[var(--color-primary)]/30 md:p-8"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${ICON_BG[f.iconTone]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold leading-[1.35] text-[#282828]">
                      {f.title}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-[#9099a3]">{f.solves}</p>
                  </div>
                </div>

                <p className="mt-4 text-[14px] leading-[1.75] text-[#5f6363]">
                  {f.body}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {f.pills.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-[12px] text-[#5f6363]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
