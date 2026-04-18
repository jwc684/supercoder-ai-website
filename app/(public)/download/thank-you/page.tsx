import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

/**
 * /download/thank-you — 소개서 신청 접수 페이지.
 *
 * 이전에는 PDF 직접 다운로드 링크를 제공했으나, 이메일 수신 경로로 일원화:
 * 리드의 이메일 유효성 확인 + 오픈·클릭 트래킹을 동시에 달성하기 위함.
 * 본 페이지는 "이메일로 발송됨" 확인 UI 만 제공한다.
 */
export default function DownloadThankYouPage() {
  return (
    <div className="bg-[#eff4ff] py-20 md:py-32">
      <div className="wp-container">
        <div className="mx-auto max-w-xl rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-[2rem] font-medium leading-[110%] text-[#282828] md:text-[2.5rem]">
            신청이 접수되었습니다
          </h1>
          <p className="mt-4 text-[16px] leading-[1.6] text-[#5f6363] md:text-[18px]">
            작성하신 이메일로 소개서 다운로드 링크를 발송했습니다.
            <br />몇 분 내 도착하지 않으면{" "}
            <strong className="text-[#282828]">스팸함도 확인</strong>해 주세요.
          </p>

          {/* 이메일 안내 박스 */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-5 py-3.5 text-left">
            <Mail
              aria-hidden
              className="h-5 w-5 shrink-0 text-[var(--color-primary)]"
            />
            <div>
              <p className="text-[12.5px] font-medium uppercase tracking-wider text-[#9099a3]">
                발송 완료
              </p>
              <p className="mt-0.5 text-[14px] font-semibold text-[#282828]">
                받은편지함을 확인해 주세요
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-[var(--color-border)] pt-8 text-left">
            <p className="text-[13px] font-semibold text-[#282828]">다음 단계</p>
            <ul className="mt-3 flex flex-col gap-2 text-[13.5px] leading-[1.55] text-[#5f6363]">
              <li className="flex gap-2">
                <span
                  aria-hidden
                  className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]"
                />
                메일이 안 보이면 10분 후 다시 확인하시거나 스팸함을 열어봐
                주세요.
              </li>
              <li className="flex gap-2">
                <span
                  aria-hidden
                  className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]"
                />
                소개서 확인 후 궁금한 점이 있으시면 도입 문의를 남겨주세요 — 1
                영업일 내 맞춤 데모 일정을 잡아드립니다.
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-5 py-2.5 text-sm font-semibold text-[#282828] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors hover:text-[var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary)]"
              >
                도입 문의하기
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-5 py-2.5 text-sm font-semibold text-[#5f6363] transition-colors hover:text-[var(--color-primary)]"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
