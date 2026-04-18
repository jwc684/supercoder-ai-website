import Link from "next/link";
import { LogoMark } from "./LogoMark";

const productLinks = [
  { label: "소개서 다운로드", href: "/download" },
  { label: "도입 문의", href: "/contact" },
  { label: "무료 체험", href: "/trial" },
];

const resourceLinks = [
  { label: "블로그", href: "/blog" },
];

const legalLinks = [
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "기업용 이용약관", href: "/terms-enterprise" },
  { label: "지원자용 이용약관", href: "/terms-candidate" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="wp-container py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-base font-bold text-[var(--color-text)]"
            >
              <LogoMark className="h-6 w-auto" title="슈퍼코더 로고" />
              슈퍼코더
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-text-sub)]">
              AI 면접이 채용의 모든 과정을 자동화합니다. 채용공고 분석부터 실시간
              AI 면접, 리포트까지.
            </p>
          </div>

          <FooterColumn title="제품" links={productLinks} />
          <FooterColumn title="리소스" links={resourceLinks} />
          <FooterColumn title="약관" links={legalLinks} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-sub)] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} 슈퍼코더. All rights reserved.</p>
          <p>Contact: contact@supercoder.ai</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--color-text-sub)] transition-colors hover:text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
