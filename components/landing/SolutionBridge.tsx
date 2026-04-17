import { Search, Clock3, ClipboardList, Zap } from "lucide-react";
import { ThoughtBubble } from "./ThoughtBubble";

/**
 * SolutionBridge — v3 narrative 의 "Solution" 섹션.
 * 좌측: 3 solution point (검증/효율/투명성 해결) w/ Pain 매핑 태그.
 * 우측: AI 면접 chat-demo 프리뷰 (2 AI 버블 + 1 유저 버블 + AI 상태 박스).
 */

type SolPoint = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  mapping: string;
  accent: "blue" | "indigo" | "emerald";
};

const points: SolPoint[] = [
  {
    icon: Search,
    title: "직무 역량 자동 추출 — 검증의 문제 해결",
    body: "JD를 분석해 Hard / Soft Skills를 분리하고, 이력서와 교차 비교합니다. HR이 직무를 몰라도 AI가 기준을 만듭니다.",
    mapping: "→ Pain 1, 2, 7 해결",
    accent: "blue",
  },
  {
    icon: Clock3,
    title: "AI가 1차 면접 전체 진행 — 효율의 문제 해결",
    body: "구조화된 질문을 자동 생성하고, 실시간 꼬리 질문으로 깊이 파악합니다. 면접관 교육 없이 일관된 수준이 유지됩니다.",
    mapping: "→ Pain 3, 4 해결",
    accent: "indigo",
  },
  {
    icon: ClipboardList,
    title: "모든 과정을 리포트로 — 투명성의 문제 해결",
    body: "역량별 점수, 답변 근거 인용, 영상 타임라인까지. \"왜 이 사람인가\"를 데이터로 경영진에게 보고할 수 있습니다.",
    mapping: "→ Pain 5, 6 해결",
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
        <ThoughtBubble>
          &ldquo;<strong className="not-italic font-semibold text-[#282828]">AI가 어떻게</strong> 이걸 해결한다는 거지? 직접 면접을 본다고?&rdquo;
        </ThoughtBubble>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          {/* 좌측: 헤더 + 3 points */}
          <div>
            <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
              AI 면접관이 하는 일
            </span>

            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
              직감이 데이터로
              <br />
              바뀌는 과정
            </h2>

            <p className="mt-5 max-w-xl text-[17px] leading-[1.7] text-[#5f6363]">
              채용공고 한 장으로 기준을 만들고, 면접으로 검증하고, 리포트로
              근거를 남깁니다.
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
                      <span className="mt-2.5 inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-[11px] font-medium text-[#6b7280]">
                        {pt.mapping}
                      </span>
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
