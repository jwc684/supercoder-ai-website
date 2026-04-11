import { z } from "zod";

/**
 * Zod 스키마 — 공개 폼 + API 요청 검증용.
 * Prisma 모델과 1:1 매핑 (schema.prisma 의 Inquiry, Download 참고).
 */

// ─── 도입 문의 (Inquiry) ──────────────────────────────────────────
// 기획문서 3.4: 회사명 · 담당자 · 이메일 · 전화 · 직책 · 채용규모 · 관심 서비스 · 메시지 · 동의

export const HIRE_SIZE_VALUES = [
  "1~10",
  "11~50",
  "51~100",
  "100+",
] as const;

export const INQUIRY_INTERESTS = [
  "AI 면접",
  "역량 분석",
  "ATS 연동",
  "기타",
] as const;

export const inquirySchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "회사명을 입력해주세요")
    .max(120, "회사명이 너무 깁니다"),
  name: z
    .string()
    .trim()
    .min(1, "담당자 이름을 입력해주세요")
    .max(60, "이름이 너무 깁니다"),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  phone: z
    .string()
    .trim()
    .min(1, "전화번호를 입력해주세요")
    .max(40, "전화번호가 너무 깁니다"),
  jobTitle: z
    .string()
    .trim()
    .max(80, "직책이 너무 깁니다")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  hireSize: z.enum(HIRE_SIZE_VALUES).optional(),
  interests: z.array(z.enum(INQUIRY_INTERESTS)).optional(),
  message: z
    .string()
    .trim()
    .max(2000, "문의 내용이 너무 깁니다")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  privacyAgreed: z
    .boolean()
    .refine((v) => v === true, "개인정보 수집 동의가 필요합니다"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// ─── 소개서 다운로드 (Download) ────────────────────────────────────
// 기획문서 3.3: 회사명 · 담당자 · 이메일 · 직책 · 전화 · 관심분야

export const DOWNLOAD_INTERESTS = [
  "AI 면접",
  "채용 자동화",
  "역량 평가",
  "보안/연동",
] as const;

export const downloadSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "회사명을 입력해주세요")
    .max(120, "회사명이 너무 깁니다"),
  name: z
    .string()
    .trim()
    .min(1, "담당자 이름을 입력해주세요")
    .max(60, "이름이 너무 깁니다"),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  jobTitle: z
    .string()
    .trim()
    .max(80, "직책이 너무 깁니다")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z
    .string()
    .trim()
    .max(40, "전화번호가 너무 깁니다")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  interests: z.array(z.enum(DOWNLOAD_INTERESTS)).optional(),
});

export type DownloadInput = z.infer<typeof downloadSchema>;

// ─── 블로그 (BlogPost) ────────────────────────────────────────────
// 기획문서 4.3 + Prisma schema 의 BlogCategory / PostStatus enum

export const BLOG_CATEGORIES = [
  "AI_HIRING",
  "INSIGHT",
  "CASE_STUDY",
  "PRODUCT_UPDATE",
] as const;

export const BLOG_CATEGORY_LABELS: Record<
  (typeof BLOG_CATEGORIES)[number],
  string
> = {
  AI_HIRING: "AI 채용",
  INSIGHT: "HR 인사이트",
  CASE_STUDY: "고객 사례",
  PRODUCT_UPDATE: "제품 업데이트",
};

export const POST_STATUSES = ["DRAFT", "PUBLISHED"] as const;

// Tiptap JSON 은 동적이므로 느슨한 object 검증
const tiptapJsonSchema = z
  .record(z.string(), z.any())
  .refine((v) => typeof v === "object" && v !== null, "Invalid Tiptap JSON");

export const blogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해주세요")
    .max(200, "제목이 너무 깁니다"),
  slug: z
    .string()
    .trim()
    .min(1, "슬러그는 필수입니다")
    .max(200)
    .regex(
      /^[a-z0-9\uAC00-\uD7A3-]+$/,
      "슬러그는 소문자/숫자/한글/하이픈만 허용됩니다",
    ),
  content: tiptapJsonSchema,
  excerpt: z
    .string()
    .trim()
    .max(500, "요약이 너무 깁니다")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  thumbnail: z
    .string()
    .trim()
    .url("올바른 URL 이 아닙니다")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  category: z.enum(BLOG_CATEGORIES),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  status: z.enum(POST_STATUSES),
  publishedAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  seoTitle: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  seoDesc: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ─── 약관 (Terms) ──────────────────────────────────────────────────
// 기획문서 4.4 + Prisma TermsType enum

export const TERMS_TYPES = [
  "PRIVACY",
  "ENTERPRISE",
  "CANDIDATE",
  "MARKETING",
] as const;

export const TERMS_TYPE_LABELS: Record<(typeof TERMS_TYPES)[number], string> = {
  PRIVACY: "개인정보처리방침",
  ENTERPRISE: "기업용 이용약관",
  CANDIDATE: "지원자용 이용약관",
  MARKETING: "마케팅 수신 동의",
};

export const termsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "약관명을 입력해주세요")
    .max(200, "약관명이 너무 깁니다"),
  type: z.enum(TERMS_TYPES),
  content: z
    .record(z.string(), z.any())
    .refine((v) => typeof v === "object" && v !== null, "Invalid Tiptap JSON"),
  version: z
    .string()
    .trim()
    .min(1, "버전을 입력해주세요")
    .max(40, "버전이 너무 깁니다"),
  effectiveDate: z.string().datetime({ offset: true }),
});

export type TermsInput = z.infer<typeof termsSchema>;

/**
 * 제목에서 슬러그 자동 생성.
 * 한글 유지 + 공백 → 하이픈 + 허용 문자만 남김.
 */
export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\uAC00-\uD7A3-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
