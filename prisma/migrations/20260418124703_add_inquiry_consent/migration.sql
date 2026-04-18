-- AlterTable: Inquiry 테이블에 법적 동의 2 필드 추가 (ageOver14, marketingAgreed).
-- privacyAgreed 는 기존 존재. 기본값 false 로 backfill 안전.
ALTER TABLE "inquiries"
  ADD COLUMN "ageOver14" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "marketingAgreed" BOOLEAN NOT NULL DEFAULT false;
