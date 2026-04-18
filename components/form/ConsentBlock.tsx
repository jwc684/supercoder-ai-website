"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

/**
 * 공용 동의 블록 — /download 와 /contact 폼에서 공유.
 *
 * UX:
 *   - 상단 "전체 동의" 체크박스: 클릭 시 아래 3개 모두 토글
 *   - 3 체크박스: 만 14세 이상[필수] · 개인정보 수집[필수] · 마케팅 수신[선택]
 *   - 각 상세 항목은 '자세히' 클릭 시 Flex.team 스타일 4-row 표로 확장
 *
 * 구현 노트:
 *   - RHF 독립. 부모가 register(name) 결과를 Props 로 전달.
 *   - 전체 동의의 checked 는 state 에서 파생 (uncontrolled indicator).
 *   - 부모는 onToggleAll 을 받아 setValue 3 개를 한 번에 호출한다.
 */

export type ConsentState = {
  ageOver14: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
};

export type ConsentBlockProps = {
  ageOver14Register: UseFormRegisterReturn;
  privacyAgreedRegister: UseFormRegisterReturn;
  marketingAgreedRegister: UseFormRegisterReturn;
  state: ConsentState;
  onToggleAll: (next: boolean) => void;
  errors?: {
    ageOver14?: string;
    privacyAgreed?: string;
  };
};

export function ConsentBlock({
  ageOver14Register,
  privacyAgreedRegister,
  marketingAgreedRegister,
  state,
  onToggleAll,
  errors,
}: ConsentBlockProps) {
  const allChecked =
    state.ageOver14 && state.privacyAgreed && state.marketingAgreed;

  return (
    <div className="flex flex-col rounded-xl border border-[var(--color-border)] bg-white p-4">
      {/* Master toggle */}
      <label className="flex cursor-pointer items-center gap-2.5 border-b border-[var(--color-border)] pb-3">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(e) => onToggleAll(e.target.checked)}
          className="h-4 w-4 shrink-0 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        <span className="flex-1 text-[13.5px] font-semibold text-[#282828]">
          전체 동의
        </span>
      </label>

      <div className="mt-3 flex flex-col gap-2">
        <ConsentRow
          label="만 14세 이상입니다."
          required
          register={ageOver14Register}
          error={errors?.ageOver14}
        />
        <ConsentRow
          label="개인정보 수집 및 이용 동의"
          required
          register={privacyAgreedRegister}
          error={errors?.privacyAgreed}
          detail={
            <ConsentTable
              rows={[
                {
                  label: "수집 목적",
                  value:
                    "슈퍼코더 AI Interviewer 서비스 소개서 발송·도입 문의 응대 대상 식별 및 연락",
                },
                {
                  label: "수집 항목",
                  value:
                    "회사명, 담당자 이름, 회사 이메일, 직책, 휴대전화번호",
                },
                {
                  label: "보유 및 이용 기간",
                  value:
                    "신청일로부터 1년 보관 또는 개인정보 삭제 요청 시까지",
                },
                {
                  label: "거부 권리",
                  value:
                    "이용자는 개인정보 수집 및 이용에 거부할 권리가 있습니다. 다만, 거부 시 서비스 제공이 제한될 수 있습니다.",
                },
              ]}
            />
          }
        />
        <ConsentRow
          label="마케팅 정보 수신 동의"
          optional
          register={marketingAgreedRegister}
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
                  value: "이름, 이메일 주소, 휴대전화번호, 회사명",
                },
                {
                  label: "보유 및 이용 기간",
                  value: "동의일로부터 3년 혹은 '수신 거부' 요청 시까지",
                },
                {
                  label: "거부 권리",
                  value:
                    "이용자는 마케팅 정보 수신 동의를 거부할 수 있으며, 거부 시 슈퍼코더의 서비스 및 이벤트 소식에서 제외됩니다.",
                },
                {
                  label: "수신 동의 철회",
                  value:
                    "이메일 하단 수신 거부 링크, 고객 지원, 또는 sales@supercoder.co 로 언제든 요청 가능합니다.",
                },
              ]}
            />
          }
        />
      </div>
    </div>
  );
}

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
  register: UseFormRegisterReturn;
  error?: string;
  detail?: ReactNode;
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
