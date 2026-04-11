import Link from "next/link";
import { Brain, MessageCircleHeart, ShieldCheck, Zap } from "lucide-react";

/**
 * KobiIntro — 기획문서 3.1 Section 4: "AI Screening Agent 코비 소개"
 * 기획문서 1.4: 전문적이면서도 따뜻한, 구조화된 대화 / 브랜드 컬러 #2563EB / 캐릭터 활용
 *
 * 레이아웃:
 *   - ≥lg: 2 컬럼 [코비 visual 카드 | 텍스트]
 *   - <lg: 1 컬럼 stacked (텍스트 위 / 카드 아래)
 */

type Trait = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

const traits: Trait[] = [
  {
    icon: Brain,
    title: "채용공고 이해",
    desc: "JD 한 장으로 직무의 핵심 역량 자동 추출",
  },
  {
    icon: MessageCircleHeart,
    title: "구조화된 대화",
    desc: "STAR · 상황 · 기술 질문을 지원자 페이스에 맞게",
  },
  {
    icon: Zap,
    title: "실시간 Deep Dive",
    desc: "답변을 듣고 즉석에서 꼬리 질문으로 파고들기",
  },
  {
    icon: ShieldCheck,
    title: "공정한 평가",
    desc: "일관된 기준과 근거 기반 리포트로 편향 최소화",
  },
];

function KobiLogoMark() {
  // 브랜드 로고 심볼 (LogoMark 와 동일한 path 인라인)
  return (
    <svg
      viewBox="0 0 113 61"
      className="h-14 w-14 md:h-20 md:w-20"
      aria-hidden
    >
      <path
        d="M68.4287 2.31816L73.1402 8.18866L73.9968 9.24686L74.6519 10.0531C73.9968 10.809 73.4677 11.7412 72.989 12.6734L55.3019 57.6722C54.3697 59.5618 52.6312 60.7208 50.7416 60.746H49.4314C47.0883 60.746 45.2742 59.6122 43.6869 57.6218L39.7816 52.7339L38.8242 51.5245C39.2525 50.945 39.6053 50.2647 39.958 49.6097L57.9978 3.82988C58.9804 1.81425 60.8701 0.378124 62.8353 0.0253906H64.0195C64.0195 0.0253906 66.4634 0.277343 68.4287 2.31816Z"
        fill="white"
        opacity="0.92"
      />
      <path
        d="M91.1296 3.12421C89.5423 1.15898 87.3 0 84.9568 0H65.0273C64.6998 0 64.3471 0 64.0195 0C65.6572 0.226757 67.4461 1.15898 68.4287 2.29277L73.1402 8.16327L73.9969 9.22147L74.6519 10.0277L90.9281 30.3603L73.1402 52.7337L72.3592 53.7415L68.2775 58.7806C67.3201 59.9647 65.9848 60.6954 64.5738 60.6954H86.5945C88.0054 60.6954 89.366 60.0151 90.3234 58.8057L112.974 30.3099L91.1296 3.12421Z"
        fill="white"
      />
      <path
        d="M43.6634 57.6216L39.7581 52.7337L38.8007 51.5243L24.515 33.5601L22.0207 30.4107L43.865 3.12421L44.8476 1.91484C45.805 0.730663 47.1403 0 48.5513 0H26.5306C25.1197 0 23.7843 0.680272 22.8269 1.86445L0 30.3351L21.6427 57.5712C23.23 59.5616 25.4724 60.6954 27.8408 60.6954H49.4079C47.0648 60.6954 45.2507 59.5868 43.6634 57.5712V57.6216Z"
        fill="white"
      />
    </svg>
  );
}

function KobiCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A6FFF] via-[#2563eb] to-[#2144A5] p-8 text-white md:p-10 lg:p-12">
      {/* 배경 원 장식 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#3A6FFF]/40 blur-3xl"
      />

      {/* 아바타 + 이름 */}
      <div className="relative flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-2 ring-white/20 md:h-24 md:w-24">
          <KobiLogoMark />
        </div>
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wider text-white/70">
            AI Screening Agent
          </p>
          <p className="mt-1 text-[28px] font-semibold leading-[1.1] md:text-[32px]">
            코비 (Kobi)
          </p>
        </div>
      </div>

      {/* 샘플 인사말 말풍선 */}
      <div className="relative mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/15 md:mt-10">
        <p className="text-[14px] leading-[1.6] text-white/90 md:text-[15px]">
          안녕하세요, 저는 코비예요. 오늘 30분 정도 편하게 이야기 나누면서
          지원해주신 포지션과 잘 맞는지 함께 확인해볼게요. 준비되셨으면 시작할게요.
        </p>
      </div>

      {/* 트레이트 태그 */}
      <div className="relative mt-6 flex flex-wrap gap-2">
        {["전문적", "따뜻한", "구조화된", "다국어"].map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white ring-1 ring-white/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function KobiIntro() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="grid items-center gap-12 md:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Left (desktop) / Bottom (mobile): Kobi 카드 visual */}
          <div className="order-2 w-full lg:order-1">
            <KobiCard />
          </div>

          {/* Right (desktop) / Top (mobile): 텍스트 */}
          <div className="order-1 flex w-full flex-col items-center text-center lg:order-2 lg:items-start lg:text-left">
            {/* Eyebrow pill */}
            <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              Meet Kobi
            </span>

            {/* H2 — title-l 스케일 */}
            <h2 className="mt-4 text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
              전문적이면서도
              <br className="hidden md:block" /> 따뜻한 AI 면접관
            </h2>

            {/* Body */}
            <p className="mt-5 max-w-xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
              코비는 단순한 챗봇이 아닙니다. 직무를 이해하고, 지원자와 실시간
              대화하며, 편향 없이 평가합니다. 한국어 · 영어 · 베트남어 · 아랍어로.
            </p>

            {/* Traits 리스트 */}
            <ul className="mt-8 grid w-full gap-4 sm:grid-cols-2">
              {traits.map((trait) => {
                const Icon = trait.icon;
                return (
                  <li
                    key={trait.title}
                    className="flex items-start gap-3 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold text-[#282828]">
                        {trait.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-[1.5] text-[#5f6363]">
                        {trait.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* CTA — 무료 체험 */}
            <div className="mt-10">
              <Link
                href="/trial"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                코비와 3분 체험하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
