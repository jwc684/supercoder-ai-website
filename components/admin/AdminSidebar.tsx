"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  MessageSquare,
  Download,
  HelpCircle,
  FileDown,
  Search,
  BarChart3,
  Image as ImageIcon,
  LogOut,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Settings,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * 메뉴 기본 순서. localStorage 에 저장된 순서가 있으면 그걸 우선 사용.
 * 새 메뉴가 추가되면 이 배열에 추가하고, 기존 사용자의 localStorage 에는
 * 해당 항목이 없으므로 자동으로 맨 끝에 붙음 (syncOrder 함수 참고).
 */
const DEFAULT_NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "블로그", icon: FileText },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/terms", label: "약관", icon: ShieldCheck },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/brochure", label: "소개서 파일", icon: FileDown },
  { href: "/admin/logos", label: "레퍼런스 로고", icon: ImageIcon },
  { href: "/admin/inquiries", label: "도입 문의", icon: MessageSquare },
  { href: "/admin/downloads", label: "소개서 다운로드", icon: Download },
] as const;

type NavItem = {
  href: string;
  label: string;
  icon: (typeof DEFAULT_NAV_ITEMS)[number]["icon"];
  exact?: boolean;
};

const STORAGE_KEY = "admin-menu-order";

/**
 * localStorage 에서 저장된 href 순서를 읽고, 현재 DEFAULT_NAV_ITEMS 와 동기화.
 * - 저장된 href 가 DEFAULT_NAV_ITEMS 에 없으면 무시 (삭제된 메뉴)
 * - DEFAULT_NAV_ITEMS 에 있는데 저장 목록에 없으면 끝에 추가 (새 메뉴)
 */
function loadOrder(): NavItem[] {
  if (typeof window === "undefined") return [...DEFAULT_NAV_ITEMS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_NAV_ITEMS];
    const savedHrefs: string[] = JSON.parse(raw);
    if (!Array.isArray(savedHrefs)) return [...DEFAULT_NAV_ITEMS];

    const itemMap = new Map<string, NavItem>(DEFAULT_NAV_ITEMS.map((it) => [it.href, it]));
    const ordered: NavItem[] = [];
    const seen = new Set<string>();

    // 저장 순서대로 배치
    for (const href of savedHrefs) {
      const item = itemMap.get(href);
      if (item && !seen.has(href)) {
        ordered.push(item);
        seen.add(href);
      }
    }
    // 새로 추가된 메뉴 (저장 목록에 없는 것) 끝에 추가
    for (const item of DEFAULT_NAV_ITEMS) {
      if (!seen.has(item.href)) {
        ordered.push(item);
      }
    }
    return ordered;
  } catch {
    return [...DEFAULT_NAV_ITEMS];
  }
}

function saveOrder(items: NavItem[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.map((it) => it.href)),
    );
  } catch {
    /* localStorage 접근 불가 환경 무시 */
  }
}

type AdminSidebarProps = {
  userEmail?: string | null;
};

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [items, setItems] = useState<NavItem[]>([...DEFAULT_NAV_ITEMS]);
  const [editMode, setEditMode] = useState(false);

  // 마운트 시 localStorage 에서 순서 로드
  useEffect(() => {
    setItems(loadOrder());
  }, []);

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    saveOrder(next);
  };

  const resetOrder = () => {
    setItems([...DEFAULT_NAV_ITEMS]);
    saveOrder([...DEFAULT_NAV_ITEMS]);
    toast.success("메뉴 순서가 초기화되었습니다.");
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
        {/* 편집 모드 토글 */}
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
            Menu
          </p>
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            title={editMode ? "편집 완료" : "메뉴 순서 편집"}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
              editMode
                ? "bg-[var(--color-primary)] text-white"
                : "text-[#9ca3af] hover:bg-[#f0f1f3] hover:text-[#5f6363]"
            }`}
          >
            {editMode ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Settings className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href} className="flex items-center gap-1">
                {editMode && (
                  <div className="flex shrink-0 flex-col">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="inline-flex h-4 w-5 items-center justify-center text-[#9ca3af] transition-colors hover:text-[var(--color-primary)] disabled:opacity-20"
                      aria-label="위로"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === items.length - 1}
                      className="inline-flex h-4 w-5 items-center justify-center text-[#9ca3af] transition-colors hover:text-[var(--color-primary)] disabled:opacity-20"
                      aria-label="아래로"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {editMode && (
                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-[#cbd5e0]" />
                )}

                <Link
                  href={editMode ? "#" : item.href}
                  onClick={editMode ? (e) => e.preventDefault() : undefined}
                  className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    editMode
                      ? "cursor-default bg-[#f8f9fa] text-[#5f6363]"
                      : active
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

        {/* 편집 모드일 때 초기화 버튼 */}
        {editMode && (
          <button
            type="button"
            onClick={resetOrder}
            className="mt-3 w-full rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-center text-[11px] font-medium text-[#9ca3af] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
          >
            기본 순서로 초기화
          </button>
        )}
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
