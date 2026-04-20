"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  inquirySchema,
  type InquiryInput,
  HIRE_SIZE_VALUES,
} from "@/lib/validations";
import { ConsentBlock } from "@/components/form/ConsentBlock";

/**
 * ContactForm — /contact 페이지의 데모 신청 폼 (client component).
 *
 * 좌측 소셜 프루프 영역의 "엔터프라이즈가 신뢰하는 파트너" 블록은
 * `logosSlot` prop 으로 주입받아 서버에서 렌더된 LogoMarquee 를 받는다.
 */

const hireSizeOptions: {
  value: (typeof HIRE_SIZE_VALUES)[number];
}[] = HIRE_SIZE_VALUES.map((v) => ({ value: v }));

export function ContactForm({ logosSlot }: { logosSlot?: ReactNode }) {
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
      message: "",
      ageOver14: false,
      privacyAgreed: false,
      marketingAgreed: false,
    },
  });

  const age = watch("ageOver14");
  const privacy = watch("privacyAgreed");
  const marketing = watch("marketingAgreed") ?? false;
  const requiredConsents = !!age && !!privacy;

  const handleToggleAll = (next: boolean) => {
    setValue("ageOver14", next, { shouldValidate: true, shouldDirty: true });
    setValue("privacyAgreed", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("marketingAgreed", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
          <div className="flex min-w-0 flex-col lg:col-span-6">
            <div>
              <h1 className="text-[3rem] font-medium leading-[100%] tracking-normal text-[#282828] md:text-[4.25rem]">
                직감 말고 데이터로
                <br />
                채용하는 법, 직접 보여드립니다
              </h1>

              <p className="mt-6 max-w-xl text-[18px] font-normal leading-[1.5] text-[#5f6363] md:text-[20px] md:leading-[30px]">
                슈퍼코더 팀과 함께 귀사의 채용 프로세스에 맞춘 맞춤 데모를
                진행합니다. 1 영업일 내 연락드려 일정을 잡아드립니다.
              </p>
            </div>

            {/* Bottom block — 리뷰 카드 + 신뢰 파트너 로고 */}
            <div className="mt-14 md:mt-16">
              <figure className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
                <blockquote className="text-[18px] font-medium leading-[1.4] text-[#282828] md:text-[20px] md:leading-[28px]">
                  “AI 면접과 함께 채용한 뒤, 60일 걸리던 개발자 채용이 사흘로
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

              {/* Trusted by — 랜딩페이지 LogoMarquee 재사용 */}
              {logosSlot ? (
                <div className="mt-10 md:mt-12">
                  <p className="text-[13px] font-normal text-[#5f6363]">
                    엔터프라이즈가 신뢰하는 파트너
                  </p>
                  {/* 마키 좌/우 페이드 마스크가 bg-alt 와 블렌드되도록 래핑 */}
                  <div className="mt-3 overflow-hidden rounded-2xl bg-[var(--color-bg-alt)] px-4 md:px-6">
                    {logosSlot}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* ────────── 우측 (col 7–12): c_form 옅은 파란색 카드 ────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full min-w-0 flex-col gap-5 rounded-3xl bg-[#eff4ff] p-8 md:p-10 lg:col-span-6"
            noValidate
          >
            <div>
              <p className="text-[22px] font-semibold leading-[1.3] text-[#282828] md:text-[24px]">
                데모 신청
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-[#5f6363]">
                아래 정보를 남겨주시면 1 영업일 내 담당자가 연락드립니다.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="회사명"
                required
                error={errors.company?.message}
                {...register("company")}
                placeholder="예: 슈퍼코더"
              />
              <SelectField
                label="회사 사이즈"
                error={errors.hireSize?.message}
                {...register("hireSize")}
              >
                <option value="">선택 (선택 사항)</option>
                {hireSizeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.value}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="담당자 이름"
                required
                error={errors.name?.message}
                {...register("name")}
                placeholder="홍길동"
              />
              <Field
                label="직책"
                error={errors.jobTitle?.message}
                {...register("jobTitle")}
                placeholder="인사팀장 (선택)"
              />
            </div>

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

            <ConsentBlock
              state={{
                ageOver14: !!age,
                privacyAgreed: !!privacy,
                marketingAgreed: !!marketing,
              }}
              ageOver14Register={register("ageOver14")}
              privacyAgreedRegister={register("privacyAgreed")}
              marketingAgreedRegister={register("marketingAgreed")}
              onToggleAll={handleToggleAll}
              errors={{
                ageOver14: errors.ageOver14?.message,
                privacyAgreed: errors.privacyAgreed?.message,
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting || !requiredConsents}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
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
