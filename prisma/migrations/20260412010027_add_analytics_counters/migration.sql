-- CreateTable
CREATE TABLE "section_views" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cta_clicks" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cta_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_dwell" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "totalMs" BIGINT NOT NULL DEFAULT 0,
    "sampleCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_dwell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "section_views_path_viewCount_idx" ON "section_views"("path", "viewCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "section_views_path_section_key" ON "section_views"("path", "section");

-- CreateIndex
CREATE INDEX "cta_clicks_path_clickCount_idx" ON "cta_clicks"("path", "clickCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "cta_clicks_path_label_key" ON "cta_clicks"("path", "label");

-- CreateIndex
CREATE UNIQUE INDEX "page_dwell_path_key" ON "page_dwell"("path");
