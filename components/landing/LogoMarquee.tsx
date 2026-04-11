/**
 * LogoMarquee — hero 섹션 아래 자동 스크롤 로고 티커.
 * Maki .c_logo_marquee 매칭:
 *   - 좌측 label + overflow hidden 마스크 + 왼쪽으로 흐르는 로고 리스트
 *   - 가장자리 흰색→투명 페이드 오버레이
 *   - 2-set 복제 후 translateX(-50%) 로 이음매 없는 루프
 * 실제 고객 로고는 Phase 5 연동. 현재는 텍스트 기반 wordmark 플레이스홀더.
 */
const companies = [
  "ACME Corp",
  "GlobalTech",
  "Nexus HR",
  "FutureWork",
  "Apex Solutions",
  "Prime Group",
  "Vanguard Co",
  "Meridian Labs",
  "Summit Ventures",
  "Horizon Inc",
];

export function LogoMarquee() {
  return (
    <div
      className="py-8 md:py-10"
      role="region"
      aria-label="고객 기업 목록"
    >
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-8">
        {/* 좌측 label — Maki .c_logo_marquee--text (w 7.5rem / 120px) */}
        <p className="shrink-0 text-center text-sm leading-[1.5] text-[#5f6363] md:w-[7.5rem] md:text-left">
          500 이상의 기업이 슈퍼코더를 신뢰합니다
        </p>

        {/* wrap_list: overflow 마스크 + 좌우 페이드 오버레이 */}
        <div className="lm-wrap relative w-full overflow-hidden">
          {/* 좌측 페이드 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent"
          />
          {/* 우측 페이드 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent"
          />

          {/* 스크롤 트랙: 2-set 복제, translateX(-50%) 로 seamless loop */}
          <div className="lm-track flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex shrink-0 items-center gap-20 pr-20 md:gap-20 md:pr-20"
                aria-hidden={copy === 1 || undefined}
              >
                {companies.map((name) => (
                  <li
                    key={`${copy}-${name}`}
                    className="flex h-8 shrink-0 items-center whitespace-nowrap text-[20px] font-bold tracking-tight text-[#282828]/50"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
