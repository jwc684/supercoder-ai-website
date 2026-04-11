"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  MessageSquare,
  Download,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "블로그", icon: FileText },
  { href: "/admin/terms", label: "약관", icon: ShieldCheck },
  { href: "/admin/inquiries", label: "도입 문의", icon: MessageSquare },
  { href: "/admin/downloads", label: "소개서 다운로드", icon: Download },
];

type AdminSidebarProps = {
  userEmail?: string | null;
};

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("로그아웃되었습니다.");
      router.refresh();
      router.push("/admin/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`로그아웃 실패: ${msg}`);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--color-border)] bg-white lg:w-64">
      {/* Logo + title */}
      <div className="flex h-20 items-center gap-2.5 border-b border-[var(--color-border)] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
          <span className="text-[13px] font-black">K</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold leading-none text-[#282828]">
            슈퍼코더
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-[#5f6363]">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "text-[#5f6363] hover:bg-[#f8f9fa] hover:text-[#282828]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + logout */}
      <div className="border-t border-[var(--color-border)] p-4">
        {userEmail && (
          <div className="mb-3 rounded-lg bg-[#f8f9fa] p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#5f6363]">
              로그인 계정
            </p>
            <p className="mt-1 truncate text-[13px] font-medium text-[#282828]">
              {userEmail}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#5f6363] transition-colors hover:bg-[#fef0ef] hover:text-[var(--color-error)]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
