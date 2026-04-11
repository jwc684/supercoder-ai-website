import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

/**
 * 관리자가 편집 가능한 정적 페이지 SEO 메타 조회.
 *
 * 동작:
 *   1. PageMeta 테이블에서 path 로 조회
 *   2. 있으면 Metadata 객체 빌드 (title, description, OG, Twitter, robots, canonical)
 *   3. 없으면 STATIC_FALLBACKS[path] 또는 전역 기본값
 *
 * path 는 URL path 그대로 ("/", "/blog", "/contact", ...).
 *
 * 사용:
 *   export async function generateMetadata(): Promise<Metadata> {
 *     return getStaticPageMeta("/contact");
 *   }
 */

type Fallback = {
  title: string;
  description: string;
};

// 정적 페이지 초기 fallback. PageMeta 에 레코드가 없거나 DB 조회 실패 시 사용.
// scripts/seed-page-meta.mjs 가 DB 에 같은 값으로 시드.
export const STATIC_FALLBACKS: Record<string, Fallback> = {
  "/": {
    title: `${SITE_NAME} — 코비(Kobi)`,
    description: SITE_DESCRIPTION,
  },
  "/blog": {
    title: "블로그",
    description:
      "AI 채용 · HR 인사이트 · 고객 사례 · 제품 업데이트 등 슈퍼코더의 최신 글을 읽어보세요.",
  },
  "/contact": {
    title: "도입 문의",
    description:
      "슈퍼코더 팀과 함께 귀사의 채용 프로세스에 맞춘 맞춤 데모를 진행합니다. 1 영업일 내 연락드립니다.",
  },
  "/download": {
    title: "서비스 소개서",
    description:
      "슈퍼코더 AI Interviewer 의 기능, 도입 사례, 가격 정책까지 한 PDF 에 담았습니다.",
  },
  "/trial": {
    title: "무료 체험",
    description:
      "슈퍼코더 AI Interviewer 의 AI 면접을 직접 체험해보세요. 현재는 1:1 맞춤 데모로 안내드립니다.",
  },
  "/privacy": {
    title: "개인정보처리방침",
    description: "슈퍼코더의 개인정보 수집·이용·보관 정책.",
  },
  "/terms-enterprise": {
    title: "기업용 이용약관",
    description: "슈퍼코더 AI Interviewer 를 도입한 기업 고객 대상 이용약관.",
  },
  "/terms-candidate": {
    title: "지원자용 이용약관",
    description: "AI 면접에 응시하는 지원자를 위한 이용약관 및 개인정보 처리 안내.",
  },
};

/**
 * 정적 페이지 메타 조회 → Next.js Metadata 객체 반환.
 */
export async function getStaticPageMeta(path: string): Promise<Metadata> {
  const fallback = STATIC_FALLBACKS[path] ?? {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  };

  let row: Awaited<
    ReturnType<typeof prisma.pageMeta.findUnique>
  > = null;
  try {
    row = await prisma.pageMeta.findUnique({ where: { path } });
  } catch (err) {
    // DB 쿼리 실패해도 메타 렌더링은 계속 — fallback 사용.
    console.error("[lib/seo] getStaticPageMeta query failed:", err);
  }

  const title = row?.title ?? fallback.title;
  const description = row?.description ?? fallback.description;
  const canonical = path === "/" ? "/" : path;

  // OG 이미지: PageMeta 에 저장된 것 우선, 없으면 전역 /og-image.png
  const ogImage = row?.socialImage ?? "/og-image.png";
  const indexable = row?.indexable ?? true;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: path.startsWith("/blog") && path !== "/blog" ? "article" : "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
          index: false,
          follow: false,
        },
  };
}
