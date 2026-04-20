import Image from "next/image";
import Link from "next/link";

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
    <footer className="bg-[#0a0a0a]">
      <div className="wp-container py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <Image
                alt="슈퍼코더"
                src="/images/logo-white.png"
                width={160}
                height={32}
                className="h-7 w-auto"
                priority={false}
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#9ca3af]">
              AI 면접이 채용의 모든 과정을 자동화합니다. 채용공고 분석부터 실시간
              AI 면접, 리포트까지.
            </p>
          </div>

          <FooterColumn title="제품" links={productLinks} />
          <FooterColumn title="리소스" links={resourceLinks} />
          <FooterColumn title="약관" links={legalLinks} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#9ca3af] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} 주식회사 세컨드팀. All rights reserved.</p>
          <p>Contact: sales@supercoder.co</p>
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
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[#9ca3af] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
