import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

/**
 * 동적 sitemap.
 *  - 정적 공개 페이지 전체
 *  - 공개 블로그 글 (PUBLISHED) 의 slug 별 개별 URL
 *
 * Next.js 가 `/sitemap.xml` 로 자동 expose 한다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 정적 페이지 — 변경 빈도에 따라 changeFrequency/priority 지정
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/download`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/trial`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-enterprise`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-candidate`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 동적: 공개 블로그 글
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    });
    blogRoutes = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    // DB 미연결 환경(예: 빌드 시 도구)에서도 sitemap 이 깨지지 않도록 swallow.
    console.error("[sitemap] blog query failed:", err);
  }

  return [...staticRoutes, ...blogRoutes];
}
