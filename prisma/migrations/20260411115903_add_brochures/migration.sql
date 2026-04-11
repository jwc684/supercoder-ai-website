-- CreateTable
CREATE TABLE "brochures" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brochures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "brochures_createdAt_idx" ON "brochures"("createdAt");
