import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

/**
 * Schema.org JSON-LD 빌더.
 *
 * 각 함수는 JSON 객체를 반환. 컴포넌트에서 `<JsonLd data={...} />` 로 렌더.
 * 또는 직접:
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *   />
 *
 * Google Search Central 가이드:
 *   https://developers.google.com/search/docs/appearance/structured-data
 */

/**
 * Organization — 사이트 전체에 1회 포함 (root layout).
 * Google 이 sidebar knowledge panel 에 사용할 수 있음.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "슈퍼코더",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: SITE_DESCRIPTION,
    sameAs: [
      // 추후 실제 소셜 계정 추가
      // "https://www.linkedin.com/company/supercoder-ai",
      // "https://twitter.com/supercoder_ai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "contact@supercoder.ai",
      areaServed: "KR",
      availableLanguage: ["Korean", "English"],
    },
  };
}

/**
 * WebSite + SearchAction — 사이트 루트.
 * Google SERP 에 sitelinks search box 활성화 가능.
 */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: `${SITE_URL}/logo.svg`,
    },
    // 향후 블로그 검색 라우트 구현 시 활성화
    // potentialAction: {
    //   "@type": "SearchAction",
    //   target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    //   "query-input": "required name=search_term_string",
    // },
  };
}

/**
 * Article — 블로그 상세 페이지에 포함.
 * Google 뉴스/디스커버 리치 결과 가능.
 */
export function articleJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  thumbnail: string | null;
  author: string;
  publishedAt: Date | string | null;
  updatedAt: Date | string;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.thumbnail ?? `${SITE_URL}/og-image.png`;
  const published =
    post.publishedAt instanceof Date
      ? post.publishedAt.toISOString()
      : (post.publishedAt ?? null);
  const modified =
    post.updatedAt instanceof Date
      ? post.updatedAt.toISOString()
      : post.updatedAt;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image,
    url,
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "ko-KR",
  };
}

/**
 * BreadcrumbList — 블로그 상세 및 정적 서브페이지.
 * SERP 에 breadcrumb 경로가 파란 글씨로 표시됨.
 *
 * items: [{name, url}, ...] — 루트부터 순서대로
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

/**
 * FAQPage — 랜딩 페이지의 FAQ 섹션용.
 * 기존 microdata (Faqs.tsx 의 itemScope/itemType) 과 병행 OK.
 * Google 은 JSON-LD 를 권장하며 둘 다 있어도 문제 없음.
 *
 * faqs: [{question, answerHtml}] — answerHtml 은 태그 제거 후 plain text 로 내보냄.
 */
export function faqPageJsonLd(faqs: { question: string; answerHtml: string }[]) {
  // HTML 태그 제거 + 주요 entity 해제. Google 은 FAQPage answer.text 에
  // plain text 를 기대하며 entity 가 남아있으면 리터럴로 표시됨.
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, "")
      // Named entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Numeric entities (&#123; and &#x1F;)
      .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
        String.fromCharCode(Number.parseInt(n, 16)),
      )
      .replace(/\s+/g, " ")
      .trim();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(f.answerHtml),
      },
    })),
  };
}

/**
 * JSON-LD 직렬화 유틸. `<script type="application/ld+json">` 에
 * `dangerouslySetInnerHTML` 로 넣을 문자열 반환.
 */
export function serializeJsonLd(data: object | object[]): string {
  return JSON.stringify(data);
}
