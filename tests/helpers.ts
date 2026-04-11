/**
 * API 테스트 공통 헬퍼.
 * - BASE_URL: 기본 http://localhost:3000 (env TEST_BASE_URL 로 override 가능)
 * - api<T>(path, init): fetch wrapper, JSON 파싱 + 상태 코드 반환
 */

export const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

export type ApiResponse<T = unknown> = {
  status: number;
  ok: boolean;
  data: T;
};

export async function api<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const contentType = res.headers.get("content-type") ?? "";
  let data: unknown;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, ok: res.ok, data: data as T };
}

/**
 * JSON body 를 가진 POST/PUT/PATCH helper.
 */
export function jsonInit(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}
