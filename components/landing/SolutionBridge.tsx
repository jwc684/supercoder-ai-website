import Image from "next/image";
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
    body: "구조화된 질문과 실시간 꼬리 질문으로 면접 전체를 자동 진행합니다. 면접관 일정 조율도, 별도 교육도 필요하지 않습니다.",
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
              AI 면접관
            </span>

            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
              직감을 데이터로 바꿉니다
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

          {/* 우측: AI 면접 라이브 프리뷰 — 인물 배경 + 무한 루프 채팅 애니메이션 */}
          <InterviewLive />
        </div>
      </div>
    </div>
  );
}

/**
 * InterviewLive — 인물 배경 위에 AI 면접 대화가 채팅처럼 무한 루프로 흐른다.
 * 사이클: 0–11s 동안 5개 요소가 차례로 페이드인 → 11–13s 모두 페이드아웃 → 반복.
 * 키프레임은 globals.css 의 .ilv-* 클래스에 정의됨 (각 버블별 등장 시점만 다름).
 */
function InterviewLive() {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-[var(--color-border)] shadow-sm sm:aspect-[16/11] md:aspect-[5/4] lg:aspect-square">
      {/* 배경 인물 이미지 — object-position 로 인물을 좌측에 배치 */}
      <Image
        src="/images/interview-candidate.png"
        alt="AI 면접 진행 중인 지원자"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-center sm:object-[85%_center]"
        priority={false}
      />

      {/* 다크 오버레이 — 모바일은 하단/전체 페이드(세로), 데스크톱은 우측 페이드(가로) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070d24]/55 to-[#070d24]/92 sm:bg-gradient-to-r sm:from-transparent sm:from-50% sm:via-[#070d24]/55 sm:via-72% sm:to-[#070d24]/90"
      />

      {/* LIVE 인디케이터 (좌상단) */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
        <span aria-hidden className="ilv-pulse h-1.5 w-1.5 rounded-full bg-red-500" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
          LIVE
        </span>
      </div>

      {/* 채팅 스택 — 모바일: 하단 풀폭 / 데스크톱: 우측 ~58% 세로중앙 */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end gap-3 px-5 pb-5 pt-8 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[58%] sm:justify-center sm:gap-4 sm:px-8 sm:py-10 lg:gap-3 lg:py-6">
        {/* 1. AI 첫 질문 */}
        <ChatBubble side="ai" cycle="b1" label="AI 면접관">
          최근 해결하셨던 가장 어려웠던 기술 문제 하나만 말씀해 주실래요? 어떤
          상황이었는지부터요.
        </ChatBubble>

        {/* 2. 지원자 답변 */}
        <ChatBubble side="user" cycle="b2">
          신규 기능 배포 직후 주문 조회 API 응답이 300ms 에서 3초까지
          느려졌어요.
        </ChatBubble>

        {/* 3. AI 꼬리 질문 */}
        <ChatBubble side="ai" cycle="b3">
          인덱스 추가와 쿼리 리팩터링 중 어떤 걸 먼저 시도하셨나요? 그 판단의
          근거가 궁금합니다.
        </ChatBubble>

        {/* 4. 지원자 답변 */}
        <ChatBubble side="user" cycle="b4">
          실행 계획부터 확인했어요. 풀 스캔이 보여서 인덱스 추가만으로 350ms
          까지 내려갔거든요.
        </ChatBubble>

        {/* 5. AI 분석 카드 (펄스) */}
        <div className="ilv-bubble ilv-b5 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 backdrop-blur-md sm:px-3 sm:py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-300 sm:text-[11px]">
            <Zap className="h-3 w-3" />
            AI 실시간 분석 중
          </p>
          <p className="mt-0.5 text-[10px] leading-[1.45] text-white/80 sm:text-[11px] sm:leading-[1.5]">
            STAR 구조 확인 · 핵심 역량 추출 · 답변 근거 인용 매칭
          </p>
        </div>
      </div>
    </div>
  );
}

type ChatBubbleProps = {
  side: "ai" | "user";
  cycle: "b1" | "b2" | "b3" | "b4";
  label?: string;
  children: React.ReactNode;
};

function ChatBubble({ side, cycle, label, children }: ChatBubbleProps) {
  const isAi = side === "ai";
  return (
    <div
      className={`ilv-bubble ilv-${cycle} flex ${isAi ? "" : "flex-row-reverse"} items-start gap-1.5 sm:gap-2`}
    >
      <Avatar kind={side} />
      <div className="min-w-0 flex-1">
        {label ? (
          <p
            className={`mb-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/65 sm:mb-1 sm:text-[10px] ${isAi ? "" : "text-right"}`}
          >
            {label}
          </p>
        ) : null}
        <div
          className={`${
            isAi
              ? "rounded-2xl rounded-tl-md bg-white/95 text-[#1f2937]"
              : "rounded-2xl rounded-tr-md bg-[var(--color-primary)] text-white"
          } px-2.5 py-1.5 text-[11px] leading-[1.5] shadow-sm sm:px-3 sm:py-2 sm:text-[12.5px] sm:leading-[1.55]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Avatar({ kind }: { kind: "ai" | "user" }) {
  if (kind === "ai") {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3A6FFF] to-[#2563eb] text-[9px] font-bold text-white shadow-sm sm:h-7 sm:w-7 sm:text-[10px]">
        AI
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/95 text-[9px] font-bold text-[#374151] ring-1 ring-white/30 shadow-sm sm:h-7 sm:w-7 sm:text-[10px]">
      지
    </div>
  );
}
