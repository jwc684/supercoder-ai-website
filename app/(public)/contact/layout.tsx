import type { Metadata } from "next";
import { getStaticPageMeta } from "@/lib/seo";

/**
 * /contact layout — client page 의 메타 주입용.
 * page.tsx 가 "use client" 라 generateMetadata 를 export 할 수 없으므로
 * layout 에서 처리.
 */
export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/contact");
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
