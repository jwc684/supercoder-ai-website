"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import {
  inquirySchema,
  type InquiryInput,
  HIRE_SIZE_VALUES,
  INQUIRY_INTERESTS,
} from "@/lib/validations";

/**
 * /contact — 데모 신청 페이지 (Maki /demo 구조 매칭).
 *
 * 12-col 2 컬럼 레이아웃:
 *   ├ 좌측 (col 1–6, g_flex--dvlsb): top(G2 배지 + H1 + subtitle) + bottom(리뷰 카드 + 고객 로고)
 *   └ 우측 (col 7–12, c_form): 옅은 파란색 배경 카드 안의 폼
 *
 * 반응형:
 *   - < lg: 1 컬럼 stacked
 *   - ≥ lg: 2 컬럼 대칭
 */

const hireSizeOptions: {
  value: (typeof HIRE_SIZE_VALUES)[number];
  label: string;
}[] = [
  { value: "1~10", label: "1~10 명" },
  { value: "11~50", label: "11~50 명" },
  { value: "51~100", label: "51~100 명" },
  { value: "100+", label: "100 명 이상" },
];

const trustedCompanies = [
  "GlobalTech",
  "BNP Paribas",
  "Capgemini",
  "Nespresso",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      phone: "",
      jobTitle: "",
      hireSize: undefined,
      interests: [],
      message: "",
      privacyAgreed: undefined as unknown as true,
    },
  });

  const selectedInterests = watch("interests") ?? [];

  const toggleInterest = (value: (typeof INQUIRY_INTERESTS)[number]) => {
    const current = selectedInterests;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("interests", next, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (values: InquiryInput) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "제출 실패");
      }
      toast.success("문의가 접수되었습니다. 1영업일 내 연락드리겠습니다.");
      setSubmitted(true);
      reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`제출에 실패했습니다. ${msg}`);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#eff4ff] py-20 md:py-32">
        <div className="wp-container">
          <div className="mx-auto max-w-xl rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-[2rem] font-medium leading-[110%] text-[#282828] md:text-[2.5rem]">
              문의가 접수되었습니다
            </h1>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#5f6363] md:text-[18px]">
              1 영업일 내에 담당자가 연락드리겠습니다. 이메일을 통해 맞춤
              데모 일정을 제안드릴 예정입니다.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center rounded-lg bg-transparent px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:underline"
              >
                다른 문의 추가로 보내기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 md:py-20 lg:py-24">
      <div className="wp-container">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ────────── 좌측 (col 1–6): Maki g_flex--dvlsb ────────── */}
          <div className="flex flex-col lg:col-span-6">
            {/* Top block — g_flex--dvlt : G2 배지 + H1 + subtitle */}
            <div>
              {/* G2-style badge (Maki .c_card_g2--badge 매칭) */}
              <div className="inline-flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#ff492c] text-[10px] font-black text-white">
                  G2
                </div>
                <div className="flex flex-col">
                  <div
                    className="flex items-center gap-0.5"
                    aria-label="5점 만점에 4.7점"
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]"
                      />
                    ))}
                  </div>
                  <p className="mt-0.5 text-[12px] font-medium leading-none text-[#282828]">
                    4.7 / 5 on G2.com
                  </p>
                </div>
              </div>

              {/* H1 — Maki g_title--xl (4.25rem / 500 / 100%) */}
              <h1 className="mt-5 text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4.25rem]">
                코비가 어떻게
                <br />
                바꾸는지 직접 보세요
              </h1>

              {/* Subtitle — g_body--l_400 */}
              <p className="mt-6 max-w-xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px] md:leading-[30px]">
                슈퍼코더 팀과 함께 귀사의 채용 프로세스에 맞춘 맞춤 데모를
                진행합니다. 1 영업일 내 연락드려 일정을 잡아드립니다.
              </p>
            </div>

            {/* Bottom block — c_demo_page--social_proof : 리뷰 카드 + 로고 */}
            <div className="mt-14 md:mt-16">
              {/* 리뷰 카드 — Maki .c_card_review_small */}
              <figure className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
                <blockquote className="text-[18px] font-medium leading-[1.4] text-[#282828] md:text-[20px] md:leading-[28px]">
                  “코비와 함께 채용한 뒤, 60일 걸리던 개발자 채용이 사흘로
                  줄었습니다. 1차 스크리닝 품질이 올라가 2차 면접의 합격률이
                  눈에 띄게 개선됐어요.”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[14px] font-bold text-[var(--color-primary)]">
                    박
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#282828]">
                      박 CHRO
                    </p>
                    <p className="text-[13px] text-[#5f6363]">
                      인사 총괄 · GlobalTech
                    </p>
                  </div>
                </figcaption>
              </figure>

              {/* Trusted by — Maki .c_logos */}
              <div className="mt-10 md:mt-12">
                <p className="text-[13px] font-normal text-[#5f6363]">
                  엔터프라이즈가 신뢰하는 파트너
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {trustedCompanies.map((name) => (
                    <span
                      key={name}
                      className="text-[16px] font-bold tracking-tight text-[#282828]/55"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ────────── 우측 (col 7–12): c_form 옅은 파란색 카드 ────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5 rounded-3xl bg-[#eff4ff] p-8 md:p-10 lg:col-span-6"
            noValidate
          >
            {/* 폼 타이틀 — Maki g_title--s_sans */}
            <div>
              <p className="text-[22px] font-semibold leading-[1.3] text-[#282828] md:text-[24px]">
                데모 신청
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-[#5f6363]">
                아래 정보를 남겨주시면 1 영업일 내 담당자가 연락드립니다.
              </p>
            </div>

            {/* Row 1: 회사명 + 담당자 */}
            <div className="grid gap-5 sm:grid-cols-2">
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
            </div>

            {/* Row 2: 이메일 + 전화 */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="이메일"
                required
                type="email"
                error={errors.email?.message}
                {...register("email")}
                placeholder="you@company.com"
              />
              <Field
                label="전화번호"
                required
                type="tel"
                error={errors.phone?.message}
                {...register("phone")}
                placeholder="010-1234-5678"
              />
            </div>

            {/* Row 3: 직책 + 채용규모 */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="직책"
                error={errors.jobTitle?.message}
                {...register("jobTitle")}
                placeholder="인사팀장 (선택)"
              />
              <SelectField
                label="월 평균 채용 규모"
                error={errors.hireSize?.message}
                {...register("hireSize")}
              >
                <option value="">선택 (선택 사항)</option>
                {hireSizeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </SelectField>
            </div>

            {/* Interests — multi pill */}
            <div>
              <span className="block text-[13px] font-medium text-[#282828]">
                관심 서비스{" "}
                <span className="text-[12px] font-normal text-[#5f6363]">
                  (복수 선택)
                </span>
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {INQUIRY_INTERESTS.map((item) => {
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

            {/* Message */}
            <div>
              <label className="block text-[13px] font-medium text-[#282828]">
                문의 내용
              </label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="구체적인 도입 니즈나 질문을 자유롭게 적어주세요."
                className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-[14px] leading-[1.6] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
              {errors.message?.message && (
                <p className="mt-1.5 text-[12px] text-[var(--color-error)]">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Privacy 동의 */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("privacyAgreed")}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-[12.5px] leading-[1.5] text-[#5f6363]">
                  <span className="font-medium text-[#282828]">
                    개인정보 수집 및 이용에 동의합니다.
                  </span>{" "}
                  수집된 정보는 도입 문의 응대와 영업 연락 목적으로만 사용되며,
                  자세한 내용은 개인정보처리방침을 따릅니다.
                </span>
              </label>
              {errors.privacyAgreed?.message && (
                <p className="mt-1.5 text-[12px] text-[var(--color-error)]">
                  {errors.privacyAgreed.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "전송 중…" : "데모 신청하기"}
            </button>
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

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  error?: string;
};

function SelectField({
  label,
  required,
  error,
  children,
  ref,
  ...props
}: SelectFieldProps & { ref?: React.Ref<HTMLSelectElement> }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[#282828]">
        {label}
        {required && (
          <span className="ml-0.5 text-[var(--color-primary)]">*</span>
        )}
      </label>
      <select
        ref={ref}
        {...props}
        className="mt-2 h-12 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 text-[14px] text-[#282828] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
      >
        {children}
      </select>
      {error && (
        <p className="mt-1.5 text-[12px] text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
