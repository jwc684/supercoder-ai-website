import { describe, it, expect } from "vitest";
import { api, jsonInit } from "../helpers";

/**
 * GET /api/blog — 공개 (PUBLISHED 만), admin (모두)
 * POST /api/blog — admin only (401 테스트)
 * GET /api/blog/[id] — 공개/admin
 * PUT/DELETE /api/blog/[id] — admin only
 */

describe("GET /api/blog (public)", () => {
  it("공개 리스트 → 200, posts 배열", async () => {
    const res = await api<{ ok: boolean; count: number; posts: unknown[] }>(
      "/api/blog",
    );
    expect(res.status).toBe(200);
    expect(res.data.ok).toBe(true);
    expect(Array.isArray(res.data.posts)).toBe(true);
    expect(typeof res.data.count).toBe("number");
  });

  it("category 쿼리 필터 → 200", async () => {
    const res = await api<{ ok: boolean }>(
      "/api/blog?category=INSIGHT",
    );
    expect(res.status).toBe(200);
    expect(res.data.ok).toBe(true);
  });

  it("q 쿼리 검색 → 200", async () => {
    const res = await api<{ ok: boolean }>("/api/blog?q=nonexistent");
    expect(res.status).toBe(200);
    expect(res.data.ok).toBe(true);
  });

  it("잘못된 category → 무시하고 200", async () => {
    const res = await api<{ ok: boolean }>(
      "/api/blog?category=INVALID_CATEGORY",
    );
    expect(res.status).toBe(200);
    expect(res.data.ok).toBe(true);
  });
});

describe("POST /api/blog (admin only)", () => {
  it("unauthenticated → 401", async () => {
    const res = await api<{ error: string }>(
      "/api/blog",
      jsonInit("POST", {
        title: "Test",
        slug: "test",
        content: { type: "doc", content: [] },
        category: "INSIGHT",
        status: "DRAFT",
      }),
    );
    expect(res.status).toBe(401);
    expect(res.data.error).toBe("Unauthorized");
  });
});

describe("GET /api/blog/[id]", () => {
  it("존재하지 않는 ID → 404", async () => {
    const res = await api<{ error: string }>("/api/blog/non-existing-id");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/blog/[id] (admin only)", () => {
  it("unauthenticated → 401", async () => {
    const res = await api<{ error: string }>(
      "/api/blog/some-id",
      jsonInit("PUT", {
        title: "X",
        slug: "x",
        content: { type: "doc", content: [] },
        category: "INSIGHT",
        status: "DRAFT",
      }),
    );
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/blog/[id] (admin only)", () => {
  it("unauthenticated → 401", async () => {
    const res = await api<{ error: string }>(
      "/api/blog/some-id",
      jsonInit("DELETE"),
    );
    expect(res.status).toBe(401);
  });
});
