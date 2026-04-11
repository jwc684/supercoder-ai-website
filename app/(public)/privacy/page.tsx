import type { Metadata } from "next";
import { getStaticPageMeta } from "@/lib/seo";
import { TermsView } from "@/components/landing/TermsView";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/privacy");
}

export default function PrivacyPage() {
  return <TermsView type="PRIVACY" />;
}
