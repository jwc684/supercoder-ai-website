import { describe, it, expect } from "vitest";
import { api } from "../helpers";

/**
 * 관리자 전용 API: 인증 없이 호출 시 401 확인.
 * - /api/admin/stats
 * - /api/upload (POST multipart)
 */

describe("GET /api/admin/stats", () => {
  it("unauthenticated → 401", async () => {
    const res = await api<{ error: string }>("/api/admin/stats");
    expect(res.status).toBe(401);
    expect(res.data.error).toBe("Unauthorized");
  });
});

describe("POST /api/upload (admin only)", () => {
  it("unauthenticated + 파일 없음 → 401", async () => {
    const res = await api<{ error: string }>("/api/upload", {
      method: "POST",
    });
    expect(res.status).toBe(401);
    expect(res.data.error).toBe("Unauthorized");
  });

  it("unauthenticated + multipart payload → 401 (인증 먼저 체크)", async () => {
    const form = new FormData();
    form.append("file", new Blob(["fake"], { type: "image/png" }), "test.png");
    const res = await api<{ error: string }>("/api/upload", {
      method: "POST",
      body: form,
    });
    expect(res.status).toBe(401);
  });
});

describe("/admin proxy 가드", () => {
  it("/admin (unauth) → 307 (redirect to login)", async () => {
    const res = await fetch("http://localhost:3000/admin", {
      redirect: "manual",
    });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin/login");
  });

  it("/admin/blog (unauth) → 307", async () => {
    const res = await fetch("http://localhost:3000/admin/blog", {
      redirect: "manual",
    });
    expect(res.status).toBe(307);
  });

  it("/admin/inquiries (unauth) → 307", async () => {
    const res = await fetch("http://localhost:3000/admin/inquiries", {
      redirect: "manual",
    });
    expect(res.status).toBe(307);
  });

  it("/admin/login (unauth) → 200 (public 접근 허용)", async () => {
    const res = await fetch("http://localhost:3000/admin/login", {
      redirect: "manual",
    });
    expect(res.status).toBe(200);
  });
});
