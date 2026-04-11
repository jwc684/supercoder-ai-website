import type { Metadata } from "next";
import { getStaticPageMeta } from "@/lib/seo";

/**
 * /download layout — client page 의 메타 주입용.
 * thank-you 하위 라우트는 이 layout 을 공유 (thank-you 에 별도 metadata 있으면 override).
 */
export async function generateMetadata(): Promise<Metadata> {
  return getStaticPageMeta("/download");
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
