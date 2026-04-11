/**
 * Site-level 상수. 메타/sitemap/robots 가 공유.
 *
 * `NEXT_PUBLIC_SITE_URL` 환경변수로 override 가능 (Vercel 배포 시 설정).
 * 기본값은 로컬 개발 편의를 위해 placeholder 도메인을 사용한다.
 */

export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://supercoder.ai"
).replace(/\/$/, "");

export const SITE_NAME = "슈퍼코더 AI Interviewer";

export const SITE_DESCRIPTION =
  "코비가 채용의 모든 과정을 자동화합니다. 채용공고 분석부터 실시간 AI 면접, 리포트까지 한 번에.";
