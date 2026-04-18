-- AlterTable: Download 테이블에 이메일 트래킹 필드 6 개 추가
-- 기존 로우는 자동으로 default 를 갖게 되므로 backfill 불필요.
ALTER TABLE "downloads"
  ADD COLUMN "emailSentAt" TIMESTAMP(3),
  ADD COLUMN "emailSendError" TEXT,
  ADD COLUMN "emailOpenCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "emailFirstOpenedAt" TIMESTAMP(3),
  ADD COLUMN "emailClickCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "emailFirstClickedAt" TIMESTAMP(3);
