import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // public/ 아래 신뢰된 SVG 로고만 사용. 외부 SVG 업로드 경로에는 적용하지 말 것.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
