"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "블로그", href: "/blog" },
  { label: "소개서 다운로드", href: "/download" },
  { label: "무료 체험", href: "/trial" },
];

/**
 * Header 레이아웃 (makipeople.com 매칭).
 *
 * 모바일 메뉴 구조 — Maki .c_navigation 방식:
 *   header (sticky, z-40, border-b)
 *     ├─ mobile overlay (absolute top-0, h-100dvh, bg-white)   ← 부모 border 를 paint-over 로 가림
 *     └─ row (relative, z-10)  ← 오버레이 위에 렌더되어 logo/hamburger 클릭 가능
 *
 * Paint order: 헤더 border → 오버레이 bg (border 위 덮음) → row (logo/햄버거)
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // 오버레이 열렸을 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // lg 이상으로 확장되면 메뉴 강제 닫기
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mql.matches) setMenuOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      {/* Mobile overlay (직계 자식, absolute, top-0, h-100dvh) — Maki 방식.
          z-index 없음 → row(z-10) 보다 아래. 오버레이 흰색 bg 가 헤더 border-bottom 을 paint-over. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        className={`absolute inset-x-0 top-0 h-[100dvh] overflow-y-auto bg-white transition-transform duration-[400ms] ease-out lg:hidden ${
          menuOpen
            ? "translate-y-0"
            : "pointer-events-none -translate-y-full"
        }`}
      >
        {/* Maki .c_navigation--menu (≤991px):
            flex-col / justify-start / padding 6.5rem 0 5rem / gap 2.5rem / h-100dvh */}
        <nav className="wp-container flex h-[100dvh] flex-col justify-between gap-10 pb-20 pt-[6.5rem]">
          {/* Maki .c_navigation--menu--wrap_links: flex-col / gap 1rem / w-full */}
          <ul className="flex w-full flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href} className="w-full">
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  // Maki .c_navigation--menu--link @ ≤991px:
                  //   font-family: Inter / font-size: 1.125rem (18px)
                  //   font-weight: 400 / line-height: 150% (27px) / color: #5f6363
                  className="block py-2 text-[18px] font-normal leading-[1.5] text-[#5f6363] transition-colors duration-200 hover:text-[var(--color-primary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Maki .c_navigation--menu--wrap_buttons: flex-col / gap 16px / w-full */}
          <div className="flex w-full flex-col gap-4">
            <Link
              href="/contact"
              onClick={closeMenu}
              // Maki .g_button_primary: padding 1rem 2rem / font 16/600/150% / radius 0.5rem
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              도입 문의
            </Link>
          </div>
        </nav>
      </div>

      {/* 헤더 Row — relative z-10 로 오버레이 위에 렌더.
          gap: 모바일은 justify-between 이면 되므로 gap-3, 데스크톱은 Maki 스펙 3.5rem.
          overflow-x-hidden: 매우 좁은 뷰포트(320px iPhone SE 1세대)에서 logo 191px + gap + button 64px
          이 280px wp-container 를 초과해 body.scrollWidth 를 늘리던 이슈 방어. */}
      <div className="wp-container relative z-10 flex h-20 items-center justify-between gap-3 overflow-x-hidden bg-white/80 backdrop-blur-md lg:gap-[3.5rem] lg:overflow-x-visible lg:backdrop-blur-none">
        {/* Logo */}
        <Link
          href="/"
          aria-label="슈퍼코더 AI Interviewer 홈"
          className="flex shrink-0 items-center"
          onClick={closeMenu}
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

        {/* Desktop navigation (≥lg) */}
        <nav className="hidden flex-1 items-center justify-between lg:flex">
          <ul className="flex items-center gap-10">
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

        {/* Mobile hamburger button (<lg) */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="-mr-1 inline-flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16 sm:-mr-2 lg:hidden"
        >
          <span className="relative block h-[18px] w-6">
            <span
              className={`absolute left-0 block h-[2px] w-6 bg-[#1f1f1f] transition-all duration-300 ease-out ${
                menuOpen ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-[2px] w-6 bg-[#1f1f1f] transition-opacity duration-300 ease-out ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-6 bg-[#1f1f1f] transition-all duration-300 ease-out ${
                menuOpen ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>
      </div>
    </header>
  );
}
