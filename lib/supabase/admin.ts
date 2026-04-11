import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 서버 전용 관리자 클라이언트.
 * SUPABASE_SECRET_KEY (service role 동등) 로 RLS 우회.
 * 절대 클라이언트 코드에 import 하지 말 것.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase admin client 미설정: NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SECRET_KEY 가 없습니다.",
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
