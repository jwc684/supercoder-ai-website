-- CreateTable
CREATE TABLE "device_views" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "device_views_device_viewCount_idx" ON "device_views"("device", "viewCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "device_views_path_device_key" ON "device_views"("path", "device");
