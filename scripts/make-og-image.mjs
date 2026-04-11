// Open Graph / Twitter 썸네일 이미지 생성기.
// 사용: node scripts/make-og-image.mjs
//
// public/logo-horizontal.svg 를 기반으로 1200x630 PNG 를 렌더.
// Facebook/LinkedIn/Twitter/Slack/Discord 등 대부분의 공유 미리보기가 1200x630 을 사용.
//
// 또한 apple-touch-icon (180x180) 과 apple-touch-icon-precomposed (180x180) 도 생성.

import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const LOGO_HORIZONTAL = path.join(ROOT, "public", "logo-horizontal.svg");
const LOGO_SQUARE = path.join(ROOT, "public", "logo.svg");

const OG_OUTPUT = path.join(ROOT, "public", "og-image.png");
const APPLE_TOUCH_OUTPUT = path.join(ROOT, "public", "apple-touch-icon.png");

/**
 * Build the OG image SVG (1200x630).
 * 흰색 배경 + 연한 파란 그라디언트 + 중앙 로고 + 한글 태그라인.
 */
function buildOgSvg(logoInnerSvg) {
  // logo-horizontal.svg 의 viewBox 는 318x40. 중앙 배치 시 폭 560 px 정도로 스케일.
  const LOGO_WIDTH = 560;
  const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 40) / 318); // ≈ 70
  const LOGO_X = (1200 - LOGO_WIDTH) / 2;
  const LOGO_Y = 210;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="55%" stop-color="#eff4ff"/>
      <stop offset="100%" stop-color="#dbe7ff"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- 배경 그라디언트 -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- 상단 얇은 브랜드 스트립 -->
  <rect x="0" y="0" width="1200" height="6" fill="#3a6fff"/>

  <!-- Eyebrow 라벨 -->
  <g transform="translate(600, 165)">
    <rect x="-85" y="-22" width="170" height="38" rx="19" fill="#ffffff" stroke="#dbe7ff" stroke-width="1.5"/>
    <text
      x="0" y="4"
      font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
      font-size="15"
      font-weight="600"
      letter-spacing="1.5"
      fill="#5f6363"
      text-anchor="middle"
    >AI AGENT 채용</text>
  </g>

  <!-- 중앙 로고 (logo-horizontal.svg 내용 임베드) -->
  <g transform="translate(${LOGO_X}, ${LOGO_Y}) scale(${LOGO_WIDTH / 318})">
    ${logoInnerSvg}
  </g>

  <!-- 태그라인 (로고 아래) -->
  <g>
    <text
      x="600" y="${LOGO_Y + LOGO_HEIGHT + 80}"
      font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
      font-size="40"
      font-weight="500"
      fill="#282828"
      text-anchor="middle"
    >코비가 채용의 모든 과정을 자동화합니다</text>
  </g>

  <!-- 서브 설명 -->
  <g>
    <text
      x="600" y="${LOGO_Y + LOGO_HEIGHT + 130}"
      font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
      font-size="22"
      font-weight="400"
      fill="#5f6363"
      text-anchor="middle"
    >채용공고 분석 · 역량 추출 · AI 면접 · 평가 리포트</text>
  </g>

  <!-- 하단 푸터 라인 + 도메인 -->
  <line x1="80" y1="570" x2="1120" y2="570" stroke="#dbe7ff" stroke-width="1.5"/>
  <text
    x="80" y="605"
    font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    font-size="18"
    font-weight="500"
    fill="#5f6363"
  >supercoder.ai</text>
  <text
    x="1120" y="605"
    font-family="'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif"
    font-size="18"
    font-weight="400"
    fill="#9ca3af"
    text-anchor="end"
  >슈퍼코더 AI Interviewer</text>
</svg>`;
}

/**
 * logo-horizontal.svg 에서 외부 <svg> 껍데기는 제거하고 내부 <g>/<path>만 추출.
 */
async function extractLogoInner(filePath) {
  const raw = await readFile(filePath, "utf8");
  // <svg ...> ... </svg> 사이의 내용만 추출
  const match = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!match) throw new Error(`SVG 파싱 실패: ${filePath}`);
  return match[1];
}

async function main() {
  console.log("🎨 OG 이미지 렌더 시작…");

  // 1. og-image.png (1200x630)
  const logoInner = await extractLogoInner(LOGO_HORIZONTAL);
  const ogSvg = buildOgSvg(logoInner);
  const ogPng = await sharp(Buffer.from(ogSvg))
    .png({ quality: 95, compressionLevel: 9 })
    .toBuffer();
  await writeFile(OG_OUTPUT, ogPng);
  const ogStat = ogPng.length;
  console.log(`✅ public/og-image.png — 1200x630 (${(ogStat / 1024).toFixed(1)} KB)`);

  // 2. apple-touch-icon.png (180x180, 정사각 로고 + 흰 배경)
  // logo.svg (113x61) 를 정사각 캔버스에 중앙 배치
  const squareCanvasSize = 180;
  const innerLogoSize = 120; // padding 30 each side

  const appleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${squareCanvasSize}" height="${squareCanvasSize}" viewBox="0 0 ${squareCanvasSize} ${squareCanvasSize}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff4ff"/>
      <stop offset="100%" stop-color="#dbe7ff"/>
    </linearGradient>
  </defs>
  <rect width="${squareCanvasSize}" height="${squareCanvasSize}" rx="36" fill="url(#bg)"/>
  <g transform="translate(${(squareCanvasSize - innerLogoSize) / 2}, ${(squareCanvasSize - (innerLogoSize * 61) / 113) / 2}) scale(${innerLogoSize / 113})">
    ${await extractLogoInner(LOGO_SQUARE)}
  </g>
</svg>`;

  const applePng = await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toBuffer();
  await writeFile(APPLE_TOUCH_OUTPUT, applePng);
  console.log(
    `✅ public/apple-touch-icon.png — 180x180 (${(applePng.length / 1024).toFixed(1)} KB)`,
  );

  console.log("\n🎉 완료!");
  console.log("\n📱 적용 확인:");
  console.log("  - app/layout.tsx 의 openGraph.images → /og-image.png");
  console.log("  - app/layout.tsx 의 icons.apple → /apple-touch-icon.png");
  console.log("\n🧪 테스트 도구:");
  console.log("  - https://www.opengraph.xyz/");
  console.log("  - https://cards-dev.twitter.com/validator");
  console.log("  - iMessage/KakaoTalk 에서 URL 붙여넣기");
}

main().catch((err) => {
  console.error("❌ 실패:", err);
  process.exit(1);
});
