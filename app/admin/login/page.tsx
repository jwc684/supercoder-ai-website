"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        throw new Error(authError.message);
      }
      if (!data.session) {
        throw new Error("세션을 생성하지 못했습니다.");
      }

      toast.success("로그인되었습니다.");
      router.push(redirectTo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      setError(msg);
      toast.error(`로그인 실패: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-5rem-12rem)] items-center justify-center bg-[#eff4ff] px-4 py-16 md:py-24">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-[1.75rem] font-medium leading-[110%] text-[#282828] md:text-[2rem]">
              관리자 로그인
            </h1>
            <p className="mt-3 text-[14px] leading-[1.5] text-[#5f6363]">
              슈퍼코더 AI Interviewer 관리자 패널에 로그인하세요.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-[#282828]"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@supercoder.ai"
                className="mt-2 h-12 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 text-[14px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-[#282828]"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="mt-2 h-12 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 text-[14px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/5 px-4 py-3 text-[13px] text-[var(--color-error)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "로그인 중…" : "로그인"}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] leading-[1.5] text-[#5f6363]">
            계정은 초대 기반으로만 생성됩니다. 문의는 contact@supercoder.ai
          </p>
        </div>
      </div>
    </div>
  );
}
