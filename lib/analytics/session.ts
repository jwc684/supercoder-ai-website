/**
 * 세션 ID 헬퍼.
 *
 * sessionStorage 기반 UUID — 탭 종료 시 자동 삭제.
 * PII 없음, 쿠키 없음, GDPR consent banner 불필요.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "sc-analytics-session";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}
