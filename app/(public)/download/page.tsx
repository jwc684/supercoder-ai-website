"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { downloadSchema, type DownloadInput } from "@/lib/validations";

/**
 * /download — 서비스 소개서 다운로드 (v3 narrative 기준, 라이트 테마 포팅).
 *
 * 구조:
 *   Header section (2-col):
 *     ├ 좌측 (col 1–6, sticky): badge + H1 + subtitle + TOC 미리보기 카드
 *     └ 우측 (col 7–12): 폼 패널 (회사명 · 담당자 · 이메일 · 직책 · 전화)
 *                       + '영업 전화 없음' 리어슈어런스
 *   Bottom CTA banner: '소개서보다 빠른 건 직접 보는 것' → /contact
 */

type TocItem = {
  title: string;
  accent: "blue" | "indigo" | "emerald" | "amber";
};

const tocItems: TocItem[] = [
  { title: "왜 채용이 어려운가 — 근본 원인 분석", accent: "blue" },
  { title: "AI 면접 4단계 실제 화면 및 출력물", accent: "indigo" },
  { title: "채용팀·현업·경영진·지원자 페르소나별 변화", accent: "indigo" },
  { title: "측정 가능한 ROI — 채용 기간·비용·합격률", accent: "emerald" },
  { title: "직군별 사용 사례 3가지", accent: "emerald" },
  { title: "보안 · 연동 · 확장 스펙", accent: "amber" },
];

const TOC_BADGE_STYLES: Record<TocItem["accent"], string> = {
  blue: "bg-[#e8f1ff] text-[#2563eb]",
  indigo: "bg-[#eef0ff] text-[#4338ca]",
  emerald: "bg-[#e6f6ee] text-[#047857]",
  amber: "bg-[#fff4dd] text-[#b45309]",
};

export default function DownloadPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DownloadInput>({
    resolver: zodResolver(downloadSchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      jobTitle: "",
      phone: "",
      interests: [],
      ageOver14: false,
      privacyAgreed: false,
      marketingAgreed: false,
    },
  });

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
      <header className="wp-container pb-10 pt-16 md:pb-14 md:pt-24 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ─── 좌측 (col 1–6): 미리보기 패널 — sticky ─── */}
          <div className="flex flex-col lg:col-span-6">
            <div className="lg:sticky lg:top-[120px]">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary-light)]/60 px-3 py-1 text-[12px] font-medium leading-[1.5] text-[var(--color-primary)]">
                <FileText className="h-3.5 w-3.5" />
                서비스 소개서
              </span>

              {/* H1 */}
              <h1 className="mt-5 text-[2.25rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#282828] md:text-[2.75rem] lg:text-[3rem]">
                채용의 감을
                <br />
                <span className="text-[var(--color-primary)]">데이터로</span>{" "}
                바꾸는
                <br />
                방법, 한 PDF에
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-[16px] leading-[1.7] text-[#5f6363] md:text-[17px]">
                채용팀, 현업 매니저, 경영진, 지원자까지 — 4개 페르소나가 각각
                어떻게 달라지는지를 실제 화면과 수치로 보여드립니다.
                의사결정자에게 바로 공유하실 수 있도록 구성했습니다.
              </p>

              {/* TOC 미리보기 카드 */}
              <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] px-5 py-4">
                  <Sparkles
                    aria-hidden
                    className="h-4 w-4 text-[var(--color-primary)]"
                  />
                  <span className="text-[13px] font-semibold text-[#282828]">
                    소개서에 담긴 것
                  </span>
                  <span className="ml-auto inline-flex items-center rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)]/60 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                    22 슬라이드
                  </span>
                </div>

                {/* List */}
                <ul>
                  {tocItems.map((item, i) => (
                    <li
                      key={item.title}
                      className={`flex items-center gap-3.5 px-5 py-3.5 ${
                        i < tocItems.length - 1
                          ? "border-b border-[var(--color-border)]"
                          : ""
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${TOC_BADGE_STYLES[item.accent]}`}
                      >
                        ✦
                      </span>
                      <p className="flex-1 text-[13.5px] font-medium leading-[1.45] text-[#282828]">
                        {item.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ─── 우측 (col 7–12): 폼 패널 ─── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-8 md:p-10 lg:col-span-6"
            noValidate
          >
            <div>
              <p className="text-[22px] font-semibold leading-[1.3] text-[#282828] md:text-[24px]">
                소개서 받기
              </p>
              <p className="mt-2 text-[13px] leading-[1.65] text-[#5f6363]">
                정보를 남겨주시면 즉시 다운로드 링크를 안내해 드립니다.
                <br />
                <span className="font-medium text-[#282828]">
                  영업 전화는 하지 않습니다.
                </span>{" "}
                이메일로만 전달됩니다.
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
              placeholder="채용 팀장 (선택)"
            />
            <Field
              label="전화번호"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
              placeholder="010-1234-5678 (선택)"
            />

            {/* ─── 법적 동의 3종 ─── */}
            <div className="mt-2 flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-white p-4">
              <ConsentRow
                label="만 14세 이상입니다."
                required
                register={register("ageOver14")}
                error={errors.ageOver14?.message}
              />
              <ConsentRow
                label="개인정보 수집 및 이용 동의"
                required
                register={register("privacyAgreed")}
                error={errors.privacyAgreed?.message}
                detail={
                  <ConsentTable
                    rows={[
                      {
                        label: "수집 목적",
                        value:
                          "슈퍼코더 AI Interviewer 서비스 소개서 발송 대상 식별 및 발송 (이메일)",
                      },
                      {
                        label: "수집 항목",
                        value:
                          "회사명, 담당자 이름, 회사 이메일, 직책, 휴대전화번호",
                      },
                      {
                        label: "보유 및 이용 기간",
                        value:
                          "소개서 신청일로부터 1년 보관 또는 개인정보 삭제 요청 시까지",
                      },
                      {
                        label: "거부 권리",
                        value:
                          "이용자는 개인정보 수집 및 이용에 거부할 권리가 있습니다. 다만, 거부 시 소개서 발송이 제한될 수 있습니다.",
                      },
                    ]}
                  />
                }
              />
              <ConsentRow
                label="마케팅 정보 수신 동의"
                optional
                register={register("marketingAgreed")}
                detail={
                  <ConsentTable
                    rows={[
                      {
                        label: "수집 목적",
                        value:
                          "슈퍼코더 AI Interviewer 도입 안내, 무료체험 안내, 미팅 확정 및 진행, 서비스 업데이트, 이벤트 공지",
                      },
                      {
                        label: "수집 항목",
                        value:
                          "이름, 이메일 주소, 휴대전화번호, 회사명",
                      },
                      {
                        label: "보유 및 이용 기간",
                        value:
                          "동의일로부터 3년 혹은 '수신 거부' 요청 시까지",
                      },
                      {
                        label: "거부 권리",
                        value:
                          "이용자는 마케팅 정보 수신 동의를 거부할 수 있으며, 거부 시 슈퍼코더의 서비스 및 이벤트 소식에서 제외됩니다.",
                      },
                      {
                        label: "수신 동의 철회",
                        value:
                          "이메일 하단 수신 거부 링크, 고객 지원, 또는 contact@supercoder.ai 로 언제든 요청 가능합니다.",
                      },
                    ]}
                  />
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? "준비 중…" : "소개서 받기"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="text-[11.5px] leading-[1.6] text-[#9099a3]">
              자세한 내용은{" "}
              <Link
                href="/privacy"
                className="underline hover:text-[#5f6363]"
              >
                개인정보처리방침
              </Link>
              을 참고해 주세요.
            </p>

            {/* 즉시 받는 안내 */}
            <div className="flex items-center justify-center gap-2 border-t border-[var(--color-border)] pt-5 text-[12.5px] text-[#5f6363]">
              <Zap
                aria-hidden
                className="h-3.5 w-3.5 text-[var(--color-primary)]"
                strokeWidth={2.5}
              />
              <span>작성 즉시 이메일로 발송됩니다. 영업 전화 없음.</span>
            </div>
          </form>
        </div>
      </header>

      {/* ─── Bottom CTA banner ─── */}
      <div className="wp-container mt-16 pb-24 md:mt-20 md:pb-28">
        <div className="mx-auto max-w-[720px] rounded-3xl border border-[var(--color-primary)]/20 bg-gradient-to-br from-[var(--color-primary-light)]/50 via-white to-[#e8f1ff]/40 px-6 py-12 text-center md:px-12 md:py-14">
          <h2 className="text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.02em] text-[#282828] md:text-[1.875rem]">
            소개서보다 빠른 건 직접 보는 것
          </h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-[#5f6363] md:text-[16px]">
            30분 맞춤 데모에서 귀사 JD로 역량 추출부터 리포트까지 직접
            확인하세요.
          </p>
          <div className="mt-7 flex items-center justify-center">
            <Link
              href="/contact"
              data-track="cta_download_banner_demo"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              데모 신청하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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

/**
 * ConsentRow — 체크박스 + [필수]/[선택] 태그 + (옵션) 상세 보기 아코디언.
 * register 는 react-hook-form 의 register(name) 반환값을 그대로 넘긴다.
 */
function ConsentRow({
  label,
  required,
  optional,
  register,
  error,
  detail,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  register: ReturnType<ReturnType<typeof useForm<DownloadInput>>["register"]>;
  error?: string;
  detail?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          {...register}
          className="h-4 w-4 shrink-0 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        {required && (
          <span className="shrink-0 rounded-md bg-[var(--color-primary-light)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
            필수
          </span>
        )}
        {optional && (
          <span className="shrink-0 rounded-md bg-[var(--color-bg-alt)] px-1.5 py-0.5 text-[10px] font-semibold text-[#6b7280]">
            선택
          </span>
        )}
        <span className="flex-1 text-[13px] leading-[1.5] text-[#282828]">
          {label}
        </span>
        {detail && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex shrink-0 items-center gap-1 text-[11.5px] font-medium text-[#6b7280] transition-colors hover:text-[var(--color-primary)]"
          >
            자세히
            <ChevronDown
              aria-hidden
              className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
      {open && detail && <div className="mt-2.5">{detail}</div>}
      {error && (
        <p className="mt-1.5 pl-6 text-[11.5px] text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
}

function ConsentTable({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <dl className="divide-y divide-[var(--color-border)]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:gap-3"
          >
            <dt className="shrink-0 text-[11px] font-semibold text-[#6b7280] sm:w-[88px]">
              {row.label}
            </dt>
            <dd className="flex-1 text-[11.5px] leading-[1.6] text-[#5f6363]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
