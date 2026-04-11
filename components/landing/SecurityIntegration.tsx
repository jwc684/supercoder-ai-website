import { ShieldCheck, Code2, Plug, Palette } from "lucide-react";

/**
 * SecurityIntegration — 기획문서 3.1 Section 11:
 * "보안 & 연동 (ISO 27001 · API · ATS 연동 · 커스터마이징)"
 */

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tags: string[];
};

const items: Item[] = [
  {
    icon: ShieldCheck,
    title: "엔터프라이즈급 보안",
    desc: "ISO 27001 인증과 엄격한 데이터 보호 정책. 고객사 데이터는 암호화되어 관리됩니다.",
    tags: ["ISO 27001", "AES-256", "GDPR"],
  },
  {
    icon: Code2,
    title: "개발자 친화 API",
    desc: "REST API 로 면접 생성, 리포트 조회, 결과 동기화 등 모든 기능을 프로그래밍적으로 제어.",
    tags: ["REST API", "Webhooks", "OAuth 2.0"],
  },
  {
    icon: Plug,
    title: "ATS · HR 시스템 연동",
    desc: "Greenhouse · Lever · 사내 ATS 등 주요 시스템과 연동 (일부 진행 중).",
    tags: ["Greenhouse", "Lever", "사내 ATS"],
  },
  {
    icon: Palette,
    title: "완전한 커스터마이징",
    desc: "면접 시간, 질문 수, 인사말, 리포트 색상/로고까지 브랜드에 맞춰 자유롭게 조정.",
    tags: ["질문/시간", "UI 색상", "로고"],
  },
];

export function SecurityIntegration() {
  return (
    <div className="bg-[#eff4ff] py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            Security & Integration
          </span>

          <h2 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
            엔터프라이즈가 신뢰하는 인프라
          </h2>

          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            보안 · API · ATS 연동 · 커스터마이징까지. 대기업 보안 요구를 충족하며,
            기존 HR 시스템과 자연스럽게 연결됩니다.
          </p>
        </div>

        {/* 2x2 카드 그리드 */}
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-7 transition-colors hover:border-[var(--color-primary)]/30 md:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.25] text-[#282828]">
                  {item.title}
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-[#5f6363]">
                  {item.desc}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-[var(--color-primary-light)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]"
                    >
                      {tag}
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
