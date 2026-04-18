-- AlterTable: Download 테이블에 법적 동의 3 필드 추가 (Boolean default false)
-- 기존 로우는 자동으로 false 를 갖게 되므로 backfill 불필요.
ALTER TABLE "downloads"
  ADD COLUMN "ageOver14" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "privacyAgreed" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "marketingAgreed" BOOLEAN NOT NULL DEFAULT false;
