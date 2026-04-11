import { Quote } from "lucide-react";

/**
 * CustomerLogos — 기획문서 3.1 Section 10: "고객 사례 (100+ 기업 로고 + 추천사)"
 * Hero 내부의 간소 LogoMarquee 와 다른 확장 버전:
 *   - 로고 그리드 (8 회사)
 *   - 3개 testimonial 카드
 */

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

const companyLogos = [
  "ACME Corp",
  "GlobalTech",
  "Nexus HR",
  "FutureWork",
  "Apex Solutions",
  "Prime Group",
  "Vanguard Co",
  "Meridian Labs",
];

const testimonials: Testimonial[] = [
  {
    quote:
      "60일 걸리던 개발자 채용이 사흘로 줄었어요. 특히 1차 스크리닝 품질이 크게 올라 2차 면접의 합격률이 눈에 띄게 개선됐습니다.",
    author: "박 CHRO",
    role: "인사 총괄",
    company: "GlobalTech",
  },
  {
    quote:
      "면접관마다 다른 기준과 기록 관리가 고민이었는데, 코비의 구조화된 리포트로 의사결정이 훨씬 명확해졌습니다.",
    author: "이 팀장",
    role: "채용 팀장",
    company: "Nexus HR",
  },
  {
    quote:
      "지원자들도 코비와의 면접이 편했다고 합니다. 모바일로 언제 어디서나 가능하다는 점이 가장 큰 장점이었어요.",
    author: "최 리크루터",
    role: "시니어 리크루터",
    company: "FutureWork",
  },
];

export function CustomerLogos() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            Customers
          </span>

          <h2 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
            100+ 기업이 코비와 채용합니다
          </h2>

          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            국내외 스타트업부터 대기업까지, 코비는 업계를 가리지 않습니다.
          </p>
        </div>

        {/* 로고 그리드 (4x2 데스크톱 / 2x4 모바일) */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 md:mt-16 md:gap-6 lg:grid-cols-8">
          {companyLogos.map((name) => (
            <div
              key={name}
              className="flex h-20 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white transition-colors hover:border-[var(--color-primary)]/30"
            >
              <span className="whitespace-nowrap text-[14px] font-bold tracking-tight text-[#282828]/55 md:text-[15px]">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial 카드 3개 */}
        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="flex flex-col gap-5 rounded-3xl border border-[var(--color-border)] bg-[#fafbff] p-7 md:p-8"
            >
              <Quote
                aria-hidden
                className="h-6 w-6 text-[var(--color-primary)]"
              />
              <blockquote className="flex-1 text-[15px] leading-[1.65] text-[#282828] md:text-[16px]">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[14px] font-bold text-[var(--color-primary)]">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#282828]">
                    {t.author}
                  </p>
                  <p className="text-[12px] text-[#5f6363]">
                    {t.role} · {t.company}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
