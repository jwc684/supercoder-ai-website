import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

/**
 * GET /api/admin/stats — 관리자 대시보드 통계.
 * 인증 필요. 응답은 문의/다운로드/블로그 count + 최근 7일 count.
 */
export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      inquiriesTotal,
      inquiriesRecent,
      inquiriesNew,
      downloadsTotal,
      downloadsRecent,
      blogPostsTotal,
      blogPostsPublished,
    ] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.download.count(),
      prisma.download.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    ]);

    return NextResponse.json({
      inquiries: {
        total: inquiriesTotal,
        recent7d: inquiriesRecent,
        new: inquiriesNew,
      },
      downloads: {
        total: downloadsTotal,
        recent7d: downloadsRecent,
      },
      blogPosts: {
        total: blogPostsTotal,
        published: blogPostsPublished,
      },
    });
  } catch (err) {
    console.error("[api/admin/stats] query failed:", err);
    return NextResponse.json(
      { error: "통계 조회 실패" },
      { status: 500 },
    );
  }
}
