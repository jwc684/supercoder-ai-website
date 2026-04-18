-- CreateTable: 레퍼런스 고객 로고 테이블.
CREATE TABLE "logos" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "storagePath" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "logos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "logos_isVisible_sortOrder_idx" ON "logos"("isVisible", "sortOrder");
