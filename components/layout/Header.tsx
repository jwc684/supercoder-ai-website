import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "블로그", href: "/blog" },
  { label: "소개서 다운로드", href: "/download" },
  { label: "무료 체험", href: "/trial" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      <div className="wp-container flex h-20 items-center">
        {/* 왼쪽 그룹: 로고 + 내비. gap-10(40px) 으로 균일 간격 */}
        <Link
          href="/"
          aria-label="슈퍼코더 AI Interviewer 홈"
          className="flex items-center"
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

        <nav className="ml-10 hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-normal text-[#5f6363] transition-colors hover:text-[var(--color-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 오른쪽: CTA */}
        <Link
          href="/contact"
          className="ml-auto inline-flex h-[45px] items-center rounded-lg bg-[var(--color-primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          도입 문의
        </Link>
      </div>
    </header>
  );
}
