import type { Metadata } from "next";
import { TermsView } from "@/components/landing/TermsView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "지원자용 이용약관",
  description:
    "AI 면접에 응시하는 지원자를 위한 이용약관 및 개인정보 처리 안내.",
  robots: { index: true, follow: true },
};

export default function TermsCandidatePage() {
  return <TermsView type="CANDIDATE" />;
}
