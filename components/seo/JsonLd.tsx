import { serializeJsonLd } from "@/lib/jsonld";

/**
 * JSON-LD 스키마 렌더 컴포넌트 — RSC 호환.
 *
 * 사용:
 *   <JsonLd data={organizationJsonLd()} />
 *   <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // 정적 JSON 직렬화 결과이므로 XSS 없음.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
