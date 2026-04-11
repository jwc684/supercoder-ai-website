import type { Metadata } from "next";
import { TermsView } from "@/components/landing/TermsView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "기업용 이용약관",
  description:
    "슈퍼코더 AI Interviewer 를 도입한 기업 고객 대상 이용약관.",
  robots: { index: true, follow: true },
};

export default function TermsEnterprisePage() {
  return <TermsView type="ENTERPRISE" />;
}
