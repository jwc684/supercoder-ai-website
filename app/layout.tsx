import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "슈퍼코더 AI Interviewer — 코비(Kobi)",
    template: "%s | 슈퍼코더 AI Interviewer",
  },
  description:
    "코비가 채용의 모든 과정을 자동화합니다. 채용공고 분석부터 실시간 AI 면접, 리포트까지 한 번에.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "슈퍼코더 AI Interviewer",
    description:
      "코비가 채용의 모든 과정을 자동화합니다. 채용공고 분석부터 실시간 AI 면접, 리포트까지 한 번에.",
    type: "website",
    locale: "ko_KR",
  },
};

/**
 * Root layout — 모든 라우트 공통. 최소한의 shell 만 담당.
 * - Public pages (홈/contact/download/blog 등): app/(public)/layout.tsx 가 Header+Footer 를 wrap
 * - Admin pages (/admin/*): app/admin/layout.tsx 가 사이드바를 wrap (Header/Footer 없음)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-white text-[#282828]">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
