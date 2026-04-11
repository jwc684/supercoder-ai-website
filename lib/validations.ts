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
