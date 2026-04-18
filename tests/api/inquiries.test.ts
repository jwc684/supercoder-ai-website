import { describe, it, expect } from "vitest";
import { api, jsonInit } from "../helpers";

/**
 * POST /api/inquiries — 공개 도입 문의 생성
 * GET /api/inquiries — 관리자 전용 리스트 조회 (401 테스트만)
 * PATCH /api/inquiries/[id] — 관리자 전용 업데이트 (401 테스트만)
 */

describe("POST /api/inquiries", () => {
  it("유효한 payload → 201 + id/createdAt 반환", async () => {
    const payload = {
      company: "Vitest Inquiry Co",
      name: "테스트 홍길동",
      email: "vitest+inquiry@example.com",
      phone: "010-0000-0000",
      hireSize: "6-20명",
      interests: ["AI 면접", "역량 분석"],
      message: "Vitest 통합 테스트로 생성된 문의입니다.",
      ageOver14: true,
      privacyAgreed: true,
      marketingAgreed: false,
    };
    const res = await api<{ ok: boolean; id: string; createdAt: string }>(
      "/api/inquiries",
      jsonInit("POST", payload),
    );
    expect(res.status).toBe(201);
    expect(res.data.ok).toBe(true);
    expect(typeof res.data.id).toBe("string");
    expect(res.data.id.length).toBeGreaterThan(0);
    expect(new Date(res.data.createdAt).toString()).not.toBe("Invalid Date");
  });

  it("privacyAgreed=false → 400 (개인정보 동의 필요)", async () => {
    const payload = {
      company: "Vitest Co",
      name: "홍길동",
      email: "a@b.com",
      phone: "010-1111-1111",
      privacyAgreed: false,
    };
    const res = await api<{ error: string }>(
      "/api/inquiries",
      jsonInit("POST", payload),
    );
    expect(res.status).toBe(400);
    expect(res.data.error).toBeDefined();
  });

  it("필수 필드 누락 (company) → 400", async () => {
    const payload = {
      name: "홍길동",
      email: "a@b.com",
      phone: "010-2222-2222",
      privacyAgreed: true,
    };
    const res = await api<{ error: string }>(
      "/api/inquiries",
      jsonInit("POST", payload),
    );
    expect(res.status).toBe(400);
  });

  it("이메일 형식 오류 → 400", async () => {
    const payload = {
      company: "Vitest",
      name: "홍길동",
      email: "not-an-email",
      phone: "010-3333-3333",
      privacyAgreed: true,
    };
    const res = await api<{ error: string }>(
      "/api/inquiries",
      jsonInit("POST", payload),
    );
    expect(res.status).toBe(400);
  });

  it("빈 body → 400", async () => {
    const res = await api("/api/inquiries", jsonInit("POST", {}));
    expect(res.status).toBe(400);
  });

  it("잘못된 JSON → 400", async () => {
    const res = await api("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/inquiries (admin only)", () => {
  it("unauthenticated → 401", async () => {
    const res = await api<{ error: string }>("/api/inquiries");
    expect(res.status).toBe(401);
    expect(res.data.error).toBe("Unauthorized");
  });
});

describe("PATCH /api/inquiries/[id] (admin only)", () => {
  it("unauthenticated → 401", async () => {
    const res = await api<{ error: string }>(
      "/api/inquiries/non-existing-id",
      jsonInit("PATCH", { status: "REVIEWED" }),
    );
    expect(res.status).toBe(401);
    expect(res.data.error).toBe("Unauthorized");
  });
});
