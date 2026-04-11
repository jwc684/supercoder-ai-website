import Link from "next/link";
import { Download, CheckCircle2 } from "lucide-react";

/**
 * /download/thank-you — 소개서 다운로드 후 감사 페이지.
 * downloadUrl 쿼리 파라미터로 파일 경로를 받아 즉시 다운로드 링크 제공.
 */
export default async function DownloadThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const params = await searchParams;
  // 보안: public/files/ 내부 파일만 허용 (URL 주입 방지)
  const rawUrl = params.url ?? "";
  const downloadUrl = rawUrl.startsWith("/files/")
    ? rawUrl
    : "/files/supercoder-brochure.pdf";

  return (
    <div className="bg-[#eff4ff] py-20 md:py-32">
      <div className="wp-container">
        <div className="mx-auto max-w-xl rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-[2rem] font-medium leading-[110%] text-[#282828] md:text-[2.5rem]">
            소개서 다운로드 준비 완료
          </h1>
          <p className="mt-4 text-[16px] leading-[1.6] text-[#5f6363] md:text-[18px]">
            아래 버튼을 눌러 바로 다운로드하세요. 동일한 링크가 입력하신
            이메일로도 전달됩니다.
          </p>

          <a
            href={downloadUrl}
            download
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-4 text-base font-semibold leading-[1.5] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            <Download className="h-4 w-4" />
            소개서 PDF 다운로드
          </a>

          <div className="mt-10 border-t border-[var(--color-border)] pt-8 text-left">
            <p className="text-[13px] font-semibold text-[#282828]">
              다음 단계
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[13.5px] leading-[1.55] text-[#5f6363]">
              <li className="flex gap-2">
                <span className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
                소개서 확인 후 궁금한 점이 있으시면 도입 문의를 남겨주세요.
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" />
                원하시면 1 영업일 내 맞춤 데모 일정을 잡아드립니다.
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
