import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * 서버 컴포넌트/서버 액션에서 관리자 세션을 요구.
 * - 세션이 없으면 /admin/login 으로 리다이렉트
 * - 있으면 Supabase User 객체 반환
 *
 * proxy.ts 가 1 차 방어선이고 이 함수는 페이지/액션 레벨의 2 차 방어선.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

/**
 * API 라우트에서 관리자 세션을 요구.
 * - 세션이 없으면 null 반환 (호출부에서 401 응답)
 * - 있으면 Supabase User 객체 반환
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
