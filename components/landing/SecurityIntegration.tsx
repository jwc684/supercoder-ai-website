import { ShieldCheck, Zap, Plug, Palette } from "lucide-react";

/**
 * SecurityIntegration — v3 narrative 의 "Enterprise" 섹션.
 * 4-up grid: 보안 / API / ATS 연동 / 커스터마이징.
 */

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tags: string[];
};

const items: Item[] = [
  {
    icon: ShieldCheck,
    title: "엔터프라이즈급 보안",
    body: "ISO 27001 인증, AES-256 암호화, GDPR 준수. 고객사 데이터는 분리 저장됩니다.",
    tags: ["ISO 27001", "AES-256", "GDPR"],
  },
  {
    icon: Zap,
    title: "개발자 친화 API",
    body: "REST API로 면접 생성, 리포트 조회, 결과 동기화 등 모든 기능을 제어합니다.",
    tags: ["REST API", "Webhooks", "OAuth 2.0"],
  },
  {
    icon: Plug,
    title: "ATS · HR 시스템 연동",
    body: "Greenhouse · Lever · 사내 ATS 등 주요 채용 시스템과 연동합니다.",
    tags: ["Greenhouse", "Lever", "사내 ATS"],
  },
  {
    icon: Palette,
    title: "완전한 커스터마이징",
    body: "면접 시간, 질문 수, AI 인사말, 리포트 색상과 로고까지 브랜드에 맞게 조정.",
    tags: ["질문/시간", "UI 색상", "로고 적용"],
  },
];

export function SecurityIntegration() {
  return (
    <div className="bg-[var(--color-bg-alt)] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
            보안 · 연동
          </span>

          <h2 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
            대기업도 신뢰하는 인프라
          </h2>

          <p className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-[#5f6363]">
            보안 · API · ATS 연동 · 커스터마이징. 기존 HR 시스템과 자연스럽게
            연결됩니다.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 text-center md:p-7"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold leading-[1.35] text-[#282828]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.6] text-[#5f6363]">
                  {item.body}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-2 py-0.5 text-[11px] text-[#6b7280]"
                    >
                      {t}
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
