import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "블로그", href: "/blog" },
  { label: "소개서 다운로드", href: "/download" },
  { label: "무료 체험", href: "/trial" },
];

/**
 * Header 레이아웃 (makipeople.com 완전 매칭)
 * .c_navigation--wrap_content 규칙:
 *   display: flex;
 *   justify-content: space-between;
 *   gap: 3.5rem (56px);
 *   align-items: center;
 * 직계 자식: [logo] + [nav (items + CTA 포함)]
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      <div className="wp-container flex h-20 items-center justify-between gap-[3.5rem]">
        {/* Left: 로고 */}
        <Link
          href="/"
          aria-label="슈퍼코더 AI Interviewer 홈"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/logo-horizontal.svg"
            alt="슈퍼코더 AI Interviewer"
            width={318}
            height={40}
            priority
            className="h-6 w-auto"
          />
        </Link>

        {/* Right group: nav items 좌측 클러스터 + CTA 우측 */}
        <nav className="flex flex-1 items-center justify-between">
          <ul className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-normal text-[#5f6363] transition-colors hover:text-[var(--color-primary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="ml-auto inline-flex h-[45px] items-center rounded-lg bg-[var(--color-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            도입 문의
          </Link>
        </nav>
      </div>
    </header>
  );
}
