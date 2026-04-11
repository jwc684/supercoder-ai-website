import type { Metadata } from "next";
import { getStaticPageMeta } from "@/lib/seo";
import { TermsView } from "@/components/landing/TermsView";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/terms-candidate");
}

export default function TermsCandidatePage() {
  return <TermsView type="CANDIDATE" />;
}
