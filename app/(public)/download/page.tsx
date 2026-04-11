"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  downloadSchema,
  type DownloadInput,
  DOWNLOAD_INTERESTS,
} from "@/lib/validations";
import { BlogFooterCta } from "@/components/landing/BlogFooterCta";

/**
 * /download — 서비스 소개서 다운로드 (Maki downloadable guide 구조 매칭).
 *
 * 구조:
 *   Header section (g_page--section):
 *     12-col, 6|6 split
 *     ├ 좌측 (col 1–6, g_flex--dvlt): label "Guide" + H1 g_title--xl +
 *     │   subtitle + rich-text 본문 설명 (5 단락)
 *     └ 우측 (col 7–12, c_form): 옅은 파란색 폼 카드
 *   Footer CTA (BlogFooterCta 재사용 — Maki .c_footer_cta 매칭)
 */

export default function DownloadPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<DownloadInput>({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      jobTitle: "",
      phone: "",
      interests: [],
    },
  });

  const selectedInterests = watch("interests") ?? [];

  const toggleInterest = (value: (typeof DOWNLOAD_INTERESTS)[number]) => {
    const current = selectedInterests;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("interests", next, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (values: DownloadInput) => {
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "제출 실패");
      }
      toast.success("소개서 다운로드가 준비되었습니다.");
      router.push(
        `/download/thank-you?url=${encodeURIComponent(json.downloadUrl)}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`제출에 실패했습니다. ${msg}`);
    }
  };

  return (
    <div className="bg-white">
      {/* ────────────── Header section ────────────── */}
      <header className="wp-container pb-10 pt-16 md:pb-14 md:pt-24 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── 좌측 (col 1–6): g_flex--dvlt ── */}
          <div className="flex flex-col lg:col-span-6">
            {/* Eyebrow — g_label */}
            <span className="inline-flex items-center self-start rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              Guide
            </span>

            {/* H1 — g_title--xl (4.25rem / 500 / 100%) */}
            <h1 className="mt-4 text-[2.75rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4.25rem]">
              슈퍼코더 AI Interviewer
              <br />
              서비스 소개서
            </h1>

            {/* Subtitle — g_body--l_400 */}
            <p className="mt-6 text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px] md:leading-[30px]">
              도입 전 검토에 필요한 모든 자료를 한 PDF 에 담았습니다.
              의사결정자에게 바로 공유하실 수 있도록 구성했어요.
            </p>

            {/* Rich text body — Maki g_rich_text 매칭 (5 단락 핵심 가치) */}
            <div className="mt-10 flex flex-col gap-5 text-[15px] leading-[1.65] text-[#5f6363] md:mt-14 md:text-[16px] md:leading-[1.7]">
              <p>
                AI 기반 채용은 더 이상 선택이 아니라 표준입니다. 그런데 대부분의
                팀은 여전히 &quot;어떤 기능이 있는가&quot; 를 비교하는 단계에
                머물러 있어요.
              </p>
              <p>
                이 소개서는 채용 실무자가 가장 먼저 확인해야 할 것을 먼저
                보여줍니다. 코비가 면접 전 과정을 어떻게 자동화하는지, 각 단계의
                실제 출력물은 어떻게 생겼는지, 우리 팀은 무엇을 책임져야
                하는지를 한 번에 이해할 수 있습니다.
              </p>
              <p>
                내부 설득을 위한 자료도 포함했습니다. 60 일 걸리던 채용이 2 일로
                줄어든 실제 사례, 합격률이 5 배 개선된 팀의 타임라인, 그리고
                비용 구조 비교표까지.
              </p>
              <p>
                기술 검토용 정보도 놓치지 않았습니다. 주요 ATS 연동 방식,
                엔터프라이즈 보안 체크리스트, 그리고 데이터 레지던시 옵션에 대한
                상세 스펙을 포함합니다.
              </p>
              <p>
                의사결정자 · HR 리드 · 보안 담당자가 각각 확인해야 할 내용을
                섹션별로 분리했습니다. 해당 페이지로 바로 건너뛸 수 있는 목차도
                함께 제공합니다.
              </p>
            </div>
          </div>

          {/* ── 우측 (col 7–12): c_form 옅은 파란색 카드 ── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5 rounded-3xl bg-[#eff4ff] p-8 md:p-10 lg:col-span-6 lg:sticky lg:top-[120px] lg:self-start"
            noValidate
          >
            {/* 폼 타이틀 — Maki g_title--s_sans */}
            <div>
              <p className="text-[22px] font-semibold leading-[1.3] text-[#282828] md:text-[24px]">
                소개서 받기
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-[#5f6363]">
                정보를 남겨주시면 바로 다운로드 링크를 안내해드립니다.
              </p>
            </div>

            <Field
              label="회사명"
              required
              error={errors.company?.message}
              {...register("company")}
              placeholder="예: 슈퍼코더"
            />
            <Field
              label="담당자 이름"
              required
              error={errors.name?.message}
              {...register("name")}
              placeholder="홍길동"
            />
            <Field
              label="이메일"
              required
              type="email"
              error={errors.email?.message}
              {...register("email")}
              placeholder="you@company.com"
            />
            <Field
              label="직책"
              error={errors.jobTitle?.message}
              {...register("jobTitle")}
              placeholder="인사팀장 (선택)"
            />
            <Field
              label="전화번호"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
              placeholder="010-1234-5678 (선택)"
            />

            {/* 관심 분야 */}
            <div>
              <span className="block text-[13px] font-medium text-[#282828]">
                관심 분야{" "}
                <span className="text-[12px] font-normal text-[#5f6363]">
                  (복수 선택, 선택 사항)
                </span>
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {DOWNLOAD_INTERESTS.map((item) => {
                  const active = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        active
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--color-border)] bg-white text-[#5f6363] hover:border-[var(--color-primary)]/40"
                      }`}
                      aria-pressed={active}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "준비 중…" : "소개서 받기"}
            </button>

            <p className="text-[11px] leading-[1.55] text-[#5f6363]">
              제출과 동시에 개인정보 수집 및 이용에 동의한 것으로 간주됩니다.
              수집 정보는 영업 및 소개서 제공 목적으로만 사용됩니다.
            </p>
          </form>
        </div>
      </header>

      {/* ────────────── Divider + Footer CTA (Maki .c_footer_cta) ────────────── */}
      <div className="wp-container mt-20 md:mt-24">
        <div className="border-t border-[var(--color-border)]" />
      </div>
      <BlogFooterCta />
    </div>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  error?: string;
};

function Field({
  label,
  required,
  error,
  ref,
  ...props
}: FieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#282828]">
        {label}
        {required && (
          <span className="ml-0.5 text-[var(--color-primary)]">*</span>
        )}
      </label>
      <input
        ref={ref}
        {...props}
        className="mt-2 h-12 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 text-[14px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
      {error && (
        <p className="mt-1.5 text-[12px] text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
