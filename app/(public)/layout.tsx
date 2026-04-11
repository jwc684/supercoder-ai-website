import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Public layout — 홈/블로그/문의/다운로드 등 공개 페이지 전용.
 * Header + main + Footer 구조. Admin 페이지는 이 레이아웃을 거치지 않음.
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
    </div>
  );
}
