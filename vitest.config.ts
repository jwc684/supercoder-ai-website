import { defineConfig } from "vitest/config";

/**
 * Vitest config — API 통합 테스트용.
 * 실행 중인 dev server (http://localhost:3000) 에 실제 HTTP 요청을 보낸다.
 * 테스트 전에 `npm run dev` 로 서버를 띄워 둘 것.
 */
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    globals: false,
    testTimeout: 15_000,
    reporters: ["default"],
  },
});
