import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { ClickTracker } from "@/components/analytics/ClickTracker";
import { DwellTracker } from "@/components/analytics/DwellTracker";

/**
 * Public layout — 홈/블로그/문의/다운로드 등 공개 페이지 전용.
 * Header + main + Footer 구조. Admin 페이지는 이 레이아웃을 거치지 않음.
 *
 * PageViewTracker 는 클라이언트 컴포넌트로, 경로 변경마다 POST /api/page-views
 * 를 호출해 공개 페이지 방문을 DB 에 append 한다. (SSR 영향 없음, return null)
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white text-[#282828]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <PageViewTracker />
      <ClickTracker />
      <DwellTracker />
    </div>
  );
}
