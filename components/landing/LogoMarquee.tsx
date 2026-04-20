import { prisma } from "@/lib/prisma";

/**
 * LogoMarquee — 레퍼런스 고객 로고 티커 (Maki .c_logo_marquee 매칭).
 * 데이터 소스: Prisma `logos` 테이블 (admin /admin/logos 에서 편집).
 * isVisible=true 인 row 만 sortOrder 오름차순으로 렌더한다.
 *
 * 구조:
 *   - 좌측 라벨 + overflow-hidden 마스크 + seamless marquee 트랙
 *   - 트랙은 2-set 복제 후 translateX(-50%) 로 이음매 없이 반복
 *   - 좌우 흰→투명 페이드 오버레이
 */
export async function LogoMarquee() {
  const logos = await prisma.logo.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, url: true },
  });

  if (logos.length === 0) return null;

  return (
    <div className="py-8 md:py-10" role="region" aria-label="고객 기업 목록">
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-8">
        {/* 좌측 label */}
        <p className="shrink-0 text-center text-sm leading-[1.5] text-[#5f6363] md:w-[7.5rem] md:text-left">
          500 이상의 기업이 슈퍼코더를 신뢰합니다
        </p>

        {/* wrap_list: overflow 마스크 + 좌우 페이드 오버레이 */}
        <div className="lm-wrap relative w-full min-w-0 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-bg-alt)] to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-bg-alt)] to-transparent"
          />

          {/* 스크롤 트랙: 2-set 복제, translateX(-50%) 로 seamless loop */}
          <div className="lm-track flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16"
                aria-hidden={copy === 1 || undefined}
              >
                {logos.map((logo) => (
                  <li
                    key={`${copy}-${logo.id}`}
                    className="flex h-10 shrink-0 items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="h-full w-auto max-w-[160px] object-contain opacity-60 grayscale transition-opacity hover:opacity-90 md:max-w-[180px]"
                      loading="lazy"
                      decoding="async"
                    />
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
