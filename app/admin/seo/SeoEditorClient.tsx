"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  Globe,
  Home,
  ImagePlus,
  Loader2,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

/**
 * /admin/seo 통합 편집기 — Webflow "Page Settings" 스타일.
 *
 * 좌측: 정적 페이지 9개 + 블로그 글 리스트 (그룹)
 * 우측: 선택된 페이지의 편집 폼
 *   - Title / URL / Description
 *   - Google SERP preview 카드 (live)
 *   - Search Engines (indexable) 토글
 *   - Social Preview image 업로드 (1200 x 630 권장)
 */

type StaticPage = {
  path: string;
  title: string;
  description: string;
  socialImage: string | null;
  socialImagePath: string | null;
  indexable: boolean;
};

type BlogPage = {
  id: string;
  path: string;
  title: string;
  slug: string;
  seoTitle: string | null;
  seoDesc: string | null;
  thumbnail: string | null;
  status: "DRAFT" | "PUBLISHED";
};

type Selection =
  | { kind: "static"; path: string }
  | { kind: "blog"; path: string };

type FormState = {
  title: string;
  description: string;
  socialImage: string | null;
  socialImagePath: string | null;
  indexable: boolean;
};

type SeoEditorClientProps = {
  staticPages: StaticPage[];
  blogPages: BlogPage[];
};

const MAX_IMG_SIZE = 5 * 1024 * 1024;

export function SeoEditorClient({
  staticPages,
  blogPages,
}: SeoEditorClientProps) {
  const router = useRouter();
  const [selection, setSelection] = useState<Selection>({
    kind: "static",
    path: staticPages[0]?.path ?? "/",
  });

  // 선택된 페이지의 원본 데이터
  const current = (() => {
    if (selection.kind === "static") {
      return staticPages.find((p) => p.path === selection.path);
    }
    return blogPages.find((p) => p.path === selection.path);
  })();

  // 편집 가능한 form state — selection 바뀔 때 initialize
  const [form, setForm] = useState<FormState>(() => initialForm(current));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  // selection 이 바뀌면 form 을 해당 페이지로 리셋
  const handleSelect = (sel: Selection) => {
    if (dirty && !window.confirm("저장하지 않은 변경사항이 있습니다. 이동할까요?")) {
      return;
    }
    setSelection(sel);
    const next =
      sel.kind === "static"
        ? staticPages.find((p) => p.path === sel.path)
        : blogPages.find((p) => p.path === sel.path);
    setForm(initialForm(next));
    setDirty(false);
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > MAX_IMG_SIZE) {
      toast.error("파일이 너무 큽니다 (최대 5MB).");
      return;
    }

    // 1200x630 권장 — 확인만, 저장은 허용
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width !== 1200 || img.height !== 630) {
        toast.warning(
          `권장 크기(1200 × 630) 와 다릅니다. 현재: ${img.width} × ${img.height}`,
        );
      }
      URL.revokeObjectURL(img.src);
    };

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/seo/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "업로드 실패");
      updateField("socialImage", json.url);
      updateField("socialImagePath", json.path);
      toast.success("이미지 업로드 완료. 저장 버튼을 눌러주세요.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`업로드 실패: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    updateField("socialImage", null);
    updateField("socialImagePath", null);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("제목과 설명은 필수입니다.");
      return;
    }

    setSaving(true);
    try {
      const encoded = encodeURIComponent(selection.path);
      const res = await fetch(`/api/seo/pages/${encoded}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          socialImage: form.socialImage,
          socialImagePath: form.socialImagePath,
          indexable: form.indexable,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "저장 실패");

      toast.success(
        `${selection.path} 저장 완료. 공개 페이지에 즉시 반영됩니다.`,
      );
      setDirty(false);
      startTransition(() => router.refresh());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`저장 실패: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      {/* ────────── 좌측 페이지 트리 ────────── */}
      <aside className="rounded-2xl border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            Page Settings
          </p>
        </div>
        <div className="flex flex-col gap-1 p-2">
          <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
            Static Pages
          </p>
          {staticPages.map((p) => {
            const active =
              selection.kind === "static" && selection.path === p.path;
            const Icon = p.path === "/" ? Home : Globe;
            return (
              <button
                key={p.path}
                type="button"
                onClick={() => handleSelect({ kind: "static", path: p.path })}
                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors ${
                  active
                    ? "bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]"
                    : "text-[#5f6363] hover:bg-[#f8f9fa] hover:text-[#282828]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{p.path === "/" ? "Home" : p.path}</span>
              </button>
            );
          })}

          {blogPages.length > 0 && (
            <>
              <p className="mt-3 px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Blog Posts ({blogPages.length})
              </p>
              <div className="max-h-[400px] overflow-y-auto">
                {blogPages.map((p) => {
                  const active =
                    selection.kind === "blog" && selection.path === p.path;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect({ kind: "blog", path: p.path })}
                      className={`flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors ${
                        active
                          ? "bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary)]"
                          : "text-[#5f6363] hover:bg-[#f8f9fa] hover:text-[#282828]"
                      }`}
                    >
                      <FileText className="mt-[2px] h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{p.title}</div>
                        <div className="truncate text-[11px] font-normal text-[#9ca3af]">
                          {p.path}
                          {p.status === "DRAFT" && " · 초안"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ────────── 우측 편집 폼 ────────── */}
      <div className="flex flex-col gap-6">
        {current ? (
          <>
            {/* Header: 페이지명 + Save */}
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                  {selection.kind === "static" ? "Static Page" : "Blog Post"}
                </p>
                <p className="mt-1 text-[18px] font-semibold text-[#282828]">
                  {selection.path === "/" ? "Home" : selection.path} Page Settings
                </p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !dirty}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "저장 중…" : "Save"}
              </button>
            </div>

            {/* Main form card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Title */}
                <div>
                  <label className="block text-[13px] font-medium text-[#282828]">
                    Title{" "}
                    <span className="font-normal text-[#9ca3af]">
                      ({form.title.length}/60)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    maxLength={200}
                    className="mt-2 h-11 w-full rounded-lg border border-[var(--color-border)] bg-[#f8f9fa] px-3 text-[14px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="Page title"
                  />
                </div>

                {/* URL (readonly) */}
                <div>
                  <label className="block text-[13px] font-medium text-[#282828]">
                    URL
                  </label>
                  <input
                    type="text"
                    value={selection.path}
                    readOnly
                    className="mt-2 h-11 w-full rounded-lg border border-[var(--color-border)] bg-[#f8f9fa] px-3 text-[14px] text-[#9ca3af]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[13px] font-medium text-[#282828]">
                    Description{" "}
                    <span className="font-normal text-[#9ca3af]">
                      ({form.description.length}/160 권장)
                    </span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={5}
                    maxLength={500}
                    className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[#f8f9fa] px-3 py-2.5 text-[14px] leading-[1.55] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    placeholder="Meta description — 검색 결과에 표시될 설명"
                  />
                </div>

                {/* Preview (live SERP card) */}
                <div>
                  <label className="block text-[13px] font-medium text-[#282828]">
                    Preview
                  </label>
                  <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-white p-4">
                    <div className="flex items-center gap-2 text-[12px] text-[#5f6363]">
                      <Search className="h-3 w-3" />
                      <span className="truncate">
                        www.supercoder.ai{selection.path === "/" ? "" : selection.path}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[16px] font-medium leading-tight text-[#1a0dab] line-clamp-1">
                      {form.title || "Title"}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-[1.4] text-[#4d5156] line-clamp-2">
                      {form.description || "Description"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Indexable toggle */}
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
                <div>
                  <p className="text-[13px] font-semibold text-[#282828]">
                    Search Engines
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#5f6363]">
                    검색 엔진이 이 페이지를 색인하고 검색 결과에 표시하도록
                    허용합니다.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={form.indexable}
                    onChange={(e) => updateField("indexable", e.target.checked)}
                    className="peer sr-only"
                    disabled={selection.kind === "blog"}
                  />
                  <span
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      form.indexable
                        ? "bg-[var(--color-primary)]"
                        : "bg-[#cbd5e0]"
                    } ${selection.kind === "blog" ? "opacity-40" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        form.indexable ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                </label>
              </div>
              {selection.kind === "blog" && (
                <p className="mt-2 text-[11px] text-[#9ca3af]">
                  블로그 글의 색인 여부는 블로그 편집기의 status (초안/발행) 에
                  따라 결정됩니다.
                </p>
              )}
            </div>

            {/* Page Images — Social Preview */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
                    Page Images
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-[#282828]">
                    Social Preview
                  </p>
                  <p className="mt-1 text-[12px] text-[#5f6363]">
                    1200 × 630 pixels · 페이스북 / 카카오톡 / 트위터 공유 시
                    썸네일로 사용
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-[13px] font-semibold text-[#282828] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? "업로드 중…" : "Upload"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="mt-5">
                {form.socialImage ? (
                  <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#f8f9fa]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.socialImage}
                      alt="Social preview"
                      className="aspect-[1200/630] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#5f6363] shadow-md transition-colors hover:bg-white hover:text-[var(--color-error)]"
                      title="이미지 제거"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={handleUploadClick}
                    className="flex aspect-[1200/630] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[#f8f9fa] text-[#9ca3af] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
                  >
                    <ImagePlus className="h-10 w-10" />
                    <p className="text-[14px] font-medium">Drop image</p>
                    <p className="text-[11px]">또는 클릭해서 선택</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[#fafbfc] p-12 text-center text-[13px] text-[#5f6363]">
            좌측에서 편집할 페이지를 선택하세요.
          </div>
        )}
      </div>
    </div>
  );
}

function initialForm(page: StaticPage | BlogPage | undefined): FormState {
  if (!page) {
    return { title: "", description: "", socialImage: null, socialImagePath: null, indexable: true };
  }
  if ("indexable" in page) {
    // StaticPage
    return {
      title: page.title,
      description: page.description,
      socialImage: page.socialImage,
      socialImagePath: page.socialImagePath,
      indexable: page.indexable,
    };
  }
  // BlogPage
  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDesc ?? "",
    socialImage: page.thumbnail,
    socialImagePath: null,
    indexable: page.status === "PUBLISHED",
  };
}
