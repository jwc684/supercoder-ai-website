-- CreateTable
CREATE TABLE "hourly_views" (
    "hour" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "hourly_views_hour_key" ON "hourly_views"("hour");
