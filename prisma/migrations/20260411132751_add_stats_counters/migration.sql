-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "stats" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "inquiriesTotal" INTEGER NOT NULL DEFAULT 0,
    "inquiriesNew" INTEGER NOT NULL DEFAULT 0,
    "downloadsTotal" INTEGER NOT NULL DEFAULT 0,
    "blogPostsTotal" INTEGER NOT NULL DEFAULT 0,
    "blogPostsPublished" INTEGER NOT NULL DEFAULT 0,
    "pageViewsTotal" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blog_posts_viewCount_idx" ON "blog_posts"("viewCount" DESC);
