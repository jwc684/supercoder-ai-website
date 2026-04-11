-- CreateTable
CREATE TABLE "page_meta" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "socialImage" TEXT,
    "socialImagePath" TEXT,
    "indexable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_meta_path_key" ON "page_meta"("path");

-- CreateIndex
CREATE INDEX "page_meta_path_idx" ON "page_meta"("path");
