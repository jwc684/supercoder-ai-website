import { Quote } from "lucide-react";

/**
 * Metrics — v3 narrative 의 "Results" 섹션.
 * 좌측: 3 metric (2일 / 5× / 90%).
 * 우측: 3 testimonials (CHRO · 채용 팀장 · 시니어 리크루터 — placeholder).
 */

type Metric = {
  num: string;
  title: string;
  body: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  initial: string;
};

const metrics: Metric[] = [
  {
    num: "2주",
    title: "평균 채용 기간 단축",
    body: "기존 60일 → 도입 후 평균 2주",
  },
  {
    num: "5×",
    title: "최종 합격률 향상",
    body: "1차 통과자의 최종 합격 비율 5배 향상",
  },
  {
    num: "90%",
    title: "채용 비용 절감",
    body: "헤드헌팅 · 면접관 인건비 대비",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "AI 리포트 덕분에 경영진에게 \"왜 이 사람을 뽑았는가\"를 처음으로 데이터로 설명할 수 있게 됐습니다. 채용팀 신뢰도가 올라갔어요.",
    author: "박 ○○ CHRO",
    role: "[고객사명 교체] — 인사 총괄",
    initial: "박",
  },
  {
    quote:
      "개발자 면접을 현업 팀장이 직접 봐야 했는데, 이제 AI가 1차를 진행해줘서 팀장들 부담이 크게 줄었습니다. 면접 품질도 오히려 더 좋아졌어요.",
    author: "이 ○○ 채용 팀장",
    role: "[고객사명 교체] — 채용팀",
    initial: "이",
  },
  {
    quote:
      "이력서에 적힌 내용이 실제인지 항상 의심스러웠는데, AI가 꼬리 질문으로 파고드니까 허위 기재를 걸러낼 수 있게 됐습니다.",
    author: "최 ○○ 시니어 리크루터",
    role: "[고객사명 교체] — HR",
    initial: "최",
  },
];

export function Metrics() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: header + 3 metric cards */}
          <div>
            <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-semibold uppercase leading-[15.6px] tracking-[0.1em] text-[var(--color-primary)]">
              도입 효과
            </span>

            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#282828] md:text-[2.5rem]">
              숫자로 확인하는
              <br />
              채용 혁신
            </h2>

            <ul className="mt-8 flex flex-col gap-3.5">
              {metrics.map((m) => (
                <li
                  key={m.title}
                  className="flex items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-6 py-5 md:px-7 md:py-6"
                >
                  <span className="min-w-[88px] text-[32px] font-bold leading-none tracking-[-0.02em] text-[var(--color-primary)] md:text-[36px]">
                    {m.num}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#282828]">
                      {m.title}
                    </p>
                    <p className="mt-1 text-[13px] text-[#5f6363]">{m.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: 3 testimonials */}
          <div className="flex flex-col gap-4">
            {testimonials.map((t) => (
              <figure
                key={t.author}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 md:p-7"
              >
                <Quote
                  aria-hidden
                  className="h-5 w-5 text-[var(--color-primary)]"
                  strokeWidth={2}
                />
                <blockquote className="mt-3 text-[14.5px] leading-[1.8] text-[#282828]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#5f6363] ring-1 ring-[var(--color-border)]">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#282828]">
                      {t.author}
                    </p>
                    <p className="text-[12px] text-[#9099a3]">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
