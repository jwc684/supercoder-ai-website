"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import {
  downloadSchema,
  type DownloadInput,
  DOWNLOAD_INTERESTS,
} from "@/lib/validations";

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
      // thank-you 페이지로 이동 (downloadUrl 쿼리 파라미터로 전달)
      router.push(
        `/download/thank-you?url=${encodeURIComponent(json.downloadUrl)}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`제출에 실패했습니다. ${msg}`);
    }
  };

  return (
    <div className="bg-[#eff4ff] py-16 md:py-20 lg:py-24">
      <div className="wp-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Left: Title + description + PDF preview */}
          <div className="flex flex-col">
            {/* Title 영역 — 좌측 상단 (Maki 레이아웃 패턴) */}
            <span className="inline-flex items-center self-start rounded-full border border-[#f0efe6] bg-white px-2 py-1 text-[12px] font-medium uppercase leading-[15.6px] tracking-normal text-[#5f6363]">
              Brochure
            </span>
            <h1 className="mt-6 text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4.25rem]">
              서비스 소개서
              <br />
              다운로드
            </h1>
            <p className="mt-6 max-w-xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px]">
              슈퍼코더 AI Interviewer 의 기능, 도입 사례, 가격 정책까지 한 번에
              확인하세요.
            </p>

            {/* PDF preview 카드 — 타이틀 아래 */}
            <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-8">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-lg">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                    PDF · 약 12 페이지
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-[#282828]">
                    슈퍼코더 AI Interviewer
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#5f6363]">
                    Product Brochure 2026
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 border-t border-[var(--color-border)] pt-5 text-[13px] leading-[1.5] text-[#5f6363]">
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  핵심 기능 4단계 상세 설명
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  도입 사례 & 성과 지표
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  ATS 연동 & API 문서 요약
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  가격 정책 & 도입 프로세스
                </li>
              </ul>
            </div>
          </div>

          {/* Right: 폼 */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 rounded-3xl border border-[var(--color-border)] bg-white p-8 md:p-10"
            noValidate
          >
            <div>
              <p className="text-[13px] font-semibold text-[var(--color-primary)]">
                리드 정보
              </p>
              <p className="mt-1 text-[15px] font-semibold text-[#282828]">
                아래 정보를 남기시면 소개서 다운로드 링크를 바로 받아보실 수
                있습니다.
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
                      className={`inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                        active
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
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
      </div>
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
