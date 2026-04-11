import type { Metadata } from "next";
import { TermsView } from "@/components/landing/TermsView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "슈퍼코더 AI Interviewer 의 개인정보 수집 · 이용 · 보관 · 파기 정책.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <TermsView type="PRIVACY" />;
}
