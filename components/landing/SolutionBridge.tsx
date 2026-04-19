import { Search, Clock3, ClipboardList, Zap } from "lucide-react";

/**
 * SolutionBridge — v3 narrative 의 "Solution" 섹션.
 * 좌측: 3 solution point (검증/효율/투명성 해결) w/ Pain 매핑 태그.
 * 우측: AI 면접 chat-demo 프리뷰 (2 AI 버블 + 1 유저 버블 + AI 상태 박스).
 */

type SolPoint = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  accent: "blue" | "indigo" | "emerald";
};

const points: SolPoint[] = [
  {
    icon: Search,
    title: "직무 역량을 AI가 정의합니다",
    body: "채용공고를 읽고 Hard / Soft Skill을 자동으로 추출해 이력서와 교차 검증합니다. HR이 직무 전문가가 아니어도 일관된 기준으로 거를 수 있습니다.",
    accent: "blue",
  },
  {
    icon: Clock3,
    title: "1차 면접을 AI가 진행합니다",
    body: "구조화된 질문과 실시간 꼬리 질문으로 30분 면접을 자동 진행합니다. 면접관 일정 조율도, 별도 교육도 필요하지 않습니다.",
    accent: "indigo",
  },
  {
    icon: ClipboardList,
    title: "결정의 근거를 리포트로 남깁니다",
    body: "역량별 점수, 답변 인용, 영상 타임라인이 한 리포트에 정리됩니다. \"왜 이 사람인가\"를 데이터로 경영진에게 설명할 수 있습니다.",
    accent: "emerald",
  },
];

const ICON_BG: Record<SolPoint["accent"], string> = {
  blue: "bg-[#e8f1ff] text-[#2563eb]",
  indigo: "bg-[#eef0ff] text-[#4338ca]",
  emerald: "bg-[#e6f6ee] text-[#047857]",
};

export function SolutionBridge() {
  return (
    <div className="bg-[var(--color-bg-alt)] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* 좌측: 헤더 + 3 points */}
          <div>
            <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
              AI 면접관이 하는 일
            </span>

            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
              부족한 기준, 시간, 근거를 AI가 채웁니다
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-[1.7] text-[#5f6363]">
              직무 역량을 자동으로 정의하고, 면접을 대신 진행하고, 결정의 근거를
              데이터로 남깁니다.
            </p>

            <ul className="mt-10 flex flex-col gap-7">
              {points.map((pt) => {
                const Icon = pt.icon;
                return (
                  <li key={pt.title} className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ICON_BG[pt.accent]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16px] font-semibold leading-[1.4] text-[#282828]">
                        {pt.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-[1.7] text-[#5f6363]">
                        {pt.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 우측: AI 면접 chat-demo 프리뷰 */}
          <ChatDemo />
        </div>
      </div>
    </div>
  );
}

function ChatDemo() {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9099a3]">
        AI 면접 진행 예시
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {/* AI greeting */}
        <div className="flex items-start gap-2.5">
          <Avatar kind="ai" />
          <div className="min-w-0 max-w-[82%]">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9099a3]">
              AI 면접관
            </p>
            <div className="rounded-2xl rounded-tl-md bg-[var(--color-bg-alt)] px-3.5 py-2.5 text-[13.5px] leading-[1.65] text-[#282828]">
              안녕하세요. 오늘 지원해주신 백엔드 개발자 포지션에 대해 30분 정도
              편하게 이야기 나눠볼게요.
            </div>
          </div>
        </div>

        {/* Candidate reply */}
        <div className="flex flex-row-reverse items-start gap-2.5">
          <Avatar kind="user" />
          <div className="min-w-0 max-w-[82%]">
            <p className="mb-1 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9099a3]">
              지원자
            </p>
            <div className="rounded-2xl rounded-tr-md border border-[#d9e3ff] bg-[var(--color-primary-light)]/60 px-3.5 py-2.5 text-[13.5px] leading-[1.65] text-[#282828]">
              네, 준비됐습니다.
            </div>
          </div>
        </div>

        {/* AI follow-up */}
        <div className="flex items-start gap-2.5">
          <Avatar kind="ai" />
          <div className="min-w-0 max-w-[82%]">
            <div className="rounded-2xl rounded-tl-md bg-[var(--color-bg-alt)] px-3.5 py-2.5 text-[13.5px] leading-[1.65] text-[#282828]">
              이력서에 대용량 트래픽 처리 경험이 있다고 하셨는데, 구체적으로 어떤
              상황이었나요? 당시 어떻게 접근하셨는지 말씀해 주세요.
            </div>
          </div>
        </div>

        {/* AI status card */}
        <div className="mt-1 rounded-xl border border-[#d9e3ff] bg-[var(--color-primary-light)]/40 px-3.5 py-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-primary)]">
            <Zap className="h-3 w-3" />
            AI 실시간 분석 중
          </p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-[#6b7280]">
            이력서 교차 검증 · STAR 구조 확인 · 꼬리 질문 생성 중…
          </p>
        </div>
      </div>
    </div>
  );
}

function Avatar({ kind }: { kind: "ai" | "user" }) {
  if (kind === "ai") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3A6FFF] to-[#2563eb] text-[11px] font-bold text-white">
        AI
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-alt)] text-[11px] font-bold text-[#6b7280] ring-1 ring-[var(--color-border)]">
      지
    </div>
  );
}
