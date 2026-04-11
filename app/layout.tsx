import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-surface text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
