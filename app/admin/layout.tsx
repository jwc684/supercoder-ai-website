import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Admin layout — 전체 관리자 페이지 공통 레이아웃.
 *
 * - 서버 컴포넌트에서 Supabase 세션을 확인 (데이터 로딩 목적)
 * - proxy.ts 가 /admin/login 제외 admin 라우트를 자동 보호
 * - 로그인 상태에서만 사이드바 렌더 (login 페이지는 사이드바 없음)
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f8f9fa] lg:flex-row">
      {user && (
        <div className="hidden lg:block">
          <AdminSidebar userEmail={user.email ?? null} />
        </div>
      )}
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}

export const metadata = {
  robots: { index: false, follow: false },
};
