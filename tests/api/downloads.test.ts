import { describe, it, expect } from "vitest";
import { api, jsonInit } from "../helpers";

/**
 * POST /api/downloads — 공개 소개서 다운로드 리드 등록
 * GET /api/downloads — 관리자 전용 (401 테스트만)
 */

describe("POST /api/downloads", () => {
  it("유효한 payload → 201 + downloadUrl 반환", async () => {
    const payload = {
      company: "Vitest Download Co",
      name: "테스트 다운로더",
      email: "vitest+download@example.com",
      jobTitle: "HR 팀장",
      phone: "010-5555-5555",
      interests: ["AI 면접", "채용 자동화"],
    };
    const res = await api<{
      ok: boolean;
      id: string;
      createdAt: string;
      downloadUrl: string;
    }>("/api/downloads", jsonInit("POST", payload));

    expect(res.status).toBe(201);
    expect(res.data.ok).toBe(true);
    expect(typeof res.data.id).toBe("string");
    expect(res.data.downloadUrl).toBe("/files/supercoder-brochure.pdf");
  });

  it("최소 필수 필드 (company/name/email) → 201", async () => {
    const res = await api<{ ok: boolean }>(
      "/api/downloads",
      jsonInit("POST", {
        company: "Minimal Co",
        name: "김최소",
        email: "minimal@example.com",
      }),
    );
    expect(res.status).toBe(201);
    expect(res.data.ok).toBe(true);
  });

  it("이메일 형식 오류 → 400", async () => {
    const res = await api(
      "/api/downloads",
      jsonInit("POST", {
        company: "Bad Email Co",
        name: "홍길동",
        email: "invalid-email",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("company 누락 → 400", async () => {
    const res = await api(
      "/api/downloads",
      jsonInit("POST", {
        name: "홍길동",
        email: "a@b.com",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("빈 body → 400", async () => {
    const res = await api("/api/downloads", jsonInit("POST", {}));
    expect(res.status).toBe(400);
  });
});

describe("GET /api/downloads (admin only)", () => {
  it("unauthenticated → 401", async () => {
    const res = await api<{ error: string }>("/api/downloads");
    expect(res.status).toBe(401);
    expect(res.data.error).toBe("Unauthorized");
  });
});

describe("GET /files/supercoder-brochure.pdf (static)", () => {
  it("브로셔 파일 존재 확인 → 200", async () => {
    const res = await api("/files/supercoder-brochure.pdf");
    expect(res.status).toBe(200);
  });
});
