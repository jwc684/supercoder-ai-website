import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { TermsEditorForm } from "../TermsEditorForm";

export default async function AdminTermsNewPage() {
  await requireAdmin();

  return (
    <div className="px-6 py-8 md:px-10 md:py-10">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/terms"
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-[#5f6363] transition-colors hover:bg-[#f0f1f3] hover:text-[#282828]"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>
      </div>
      <div className="mt-3">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
          New Terms
        </p>
        <h1 className="text-[24px] font-medium leading-[1.2] text-[#282828] md:text-[28px]">
          새 약관 작성
        </h1>
        <p className="mt-1 text-[13px] text-[#5f6363]">
          생성 후 비활성 상태로 저장되며, 편집 페이지에서 활성화할 수 있습니다.
        </p>
      </div>

      <div className="mt-6">
        <TermsEditorForm mode="new" />
      </div>
    </div>
  );
}
