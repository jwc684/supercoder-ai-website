import Link from "next/link";
import {
  FileSearch,
  Layers,
  Eye,
  FileText,
} from "lucide-react";

/**
 * AiServiceDetail — 기획문서 3.1 Section 7:
 * "AI 면접 서비스 상세 (채용공고 × 이력서 분석 · Deep dive · Proctoring · 리포트)"
 * CTA: 소개서 다운로드
 */

type Detail = {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
};

const details: Detail[] = [
  {
    icon: FileSearch,
    eyebrow: "Deep Analysis",
    title: "채용공고 × 이력서 교차 분석",
    desc: "JD 와 이력서를 함께 보고 매칭도·강점·추가 검증 영역을 즉시 파악합니다.",
    points: [
      "이력서-공고 매칭 점수",
      "강점/약점 분석",
      "맞춤 검증 질문 제안",
    ],
  },
  {
    icon: Layers,
    eyebrow: "Real-time",
    title: "실시간 Deep Dive",
    desc: "답변을 들은 코비가 즉석에서 꼬리 질문을 던져 표면 답변을 넘어갑니다.",
    points: [
      "응답 의미 실시간 분석",
      "근거를 요구하는 후속 질문",
      "구조화된 면접 유지",
    ],
  },
  {
    icon: Eye,
    eyebrow: "Proctoring",
    title: "부정행위 감지",
    desc: "화면 이탈 · 다중 인물 · 마우스 움직임까지 감시해 공정한 평가를 보장합니다.",
    points: [
      "얼굴 인식 · 다중 인물 감지",
      "화면 · 탭 이동 감지",
      "Low / Medium / High 리스크",
    ],
  },
  {
    icon: FileText,
    eyebrow: "Report",
    title: "AI 면접 리포트",
    desc: "종합 점수, 근거 인용, 부정행위 분석, 2차 면접용 질문까지 한 번에.",
    points: [
      "역량별 점수 + 총점",
      "영상·스크립트 재생",
      "이력서 매칭 리포트",
    ],
  },
];

export function AiServiceDetail() {
  return (
    <div className="bg-white py-20 md:py-28 lg:py-32">
      <div className="wp-container">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
            AI Interview Service
          </span>

          <h2 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[110%] tracking-normal text-[#282828] md:text-[3.5rem]">
            단순 스크리닝을 넘어, 구조화된 심층 면접
          </h2>

          <p className="mt-5 max-w-2xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
            이력서 교차 분석부터 실시간 꼬리 질문, 부정행위 감지, 구조화된
            리포트까지 — 한 번의 세팅으로.
          </p>
        </div>

        {/* 2x2 큰 카드 그리드 */}
        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 md:gap-6 lg:gap-8">
          {details.map((d) => {
            const Icon = d.icon;
            return (
              <article
                key={d.title}
                className="flex flex-col gap-6 rounded-3xl border border-[var(--color-border)] bg-white p-7 transition-shadow hover:shadow-lg md:flex-row md:p-8"
              >
                {/* 아이콘 영역 */}
                <div className="shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>

                {/* 본문 */}
                <div className="flex flex-col gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                    {d.eyebrow}
                  </p>
                  <h3 className="text-[22px] font-semibold leading-[1.25] text-[#282828] md:text-[24px]">
                    {d.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.6] text-[#5f6363]">
                    {d.desc}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {d.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-[13px] text-[#5f6363]"
                      >
                        <span
                          aria-hidden
                          className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA — 소개서 다운로드 */}
        <div className="mt-12 flex justify-center md:mt-16">
          <Link
            href="/download"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-8 py-4 text-base font-semibold leading-[1.5] text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
          >
            소개서 다운로드
          </Link>
        </div>
      </div>
    </div>
  );
}
