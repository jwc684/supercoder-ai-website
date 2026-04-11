"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Save, Trash2, Image as ImageIcon, X } from "lucide-react";
import { RichEditor, type RichEditorContent } from "@/components/admin/RichEditor";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_LABELS,
  POST_STATUSES,
  slugify,
} from "@/lib/validations";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: (typeof BLOG_CATEGORIES)[number];
  tags: string[];
  status: (typeof POST_STATUSES)[number];
  publishedAt: string; // datetime-local string or empty
  seoTitle: string;
  seoDesc: string;
  content: RichEditorContent | null;
};

type BlogEditorFormProps = {
  mode: "new" | "edit";
  postId?: string;
  initial?: Partial<FormState>;
};

const EMPTY_CONTENT: RichEditorContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function BlogEditorForm({ mode, postId, initial }: BlogEditorFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    thumbnail: initial?.thumbnail ?? "",
    category: initial?.category ?? "INSIGHT",
    tags: initial?.tags ?? [],
    status: initial?.status ?? "DRAFT",
    publishedAt: initial?.publishedAt ?? "",
    seoTitle: initial?.seoTitle ?? "",
    seoDesc: initial?.seoDesc ?? "",
    content: initial?.content ?? EMPTY_CONTENT,
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // 제목 변경 시 슬러그가 수동 편집되지 않았다면 자동 생성
  useEffect(() => {
    if (!slugEdited && mode === "new") {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, slugEdited, mode]);

  const handleContentChange = (json: RichEditorContent) => {
    setForm((prev) => ({ ...prev, content: json }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (form.tags.includes(t)) {
      setTagInput("");
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "업로드 실패");
      setForm((prev) => ({ ...prev, thumbnail: json.url }));
      toast.success("썸네일이 업로드되었습니다.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`썸네일 업로드 실패: ${msg}`);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("슬러그는 필수입니다");
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content ?? EMPTY_CONTENT,
      excerpt: form.excerpt.trim() || undefined,
      thumbnail: form.thumbnail.trim() || undefined,
      category: form.category,
      tags: form.tags,
      status: form.status,
      publishedAt: form.publishedAt
        ? new Date(form.publishedAt).toISOString()
        : undefined,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDesc: form.seoDesc.trim() || undefined,
    };

    setSaving(true);
    try {
      const res = await fetch(
        mode === "new" ? "/api/blog" : `/api/blog/${postId}`,
        {
          method: mode === "new" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "저장 실패");

      toast.success(
        mode === "new" ? "블로그 글이 생성되었습니다." : "저장되었습니다.",
      );
      if (mode === "new") {
        router.push(`/admin/blog/${json.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`저장 실패: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "edit" || !postId) return;
    if (!window.confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${postId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "삭제 실패");
      toast.success("삭제되었습니다.");
      router.push("/admin/blog");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`삭제 실패: ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      {/* Main: 제목 + 에디터 */}
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <label className="block text-[12px] font-medium text-[#5f6363]">
            제목
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="예) 코비가 채용을 바꾼 방법"
            className="mt-2 w-full border-0 bg-transparent text-[28px] font-medium leading-[1.2] text-[#282828] placeholder:text-[#9ca3af] focus:outline-none"
          />

          {/* 설명 (Description) — 목록 카드와 상세 페이지 타이틀 아래에 노출 */}
          <div className="mt-5 border-t border-[var(--color-border)] pt-5">
            <label className="block text-[12px] font-medium text-[#282828]">
              설명 (Description)
            </label>
            <p className="mt-1 text-[11px] leading-[1.5] text-[#9ca3af]">
              블로그 목록 카드와 상세 페이지 타이틀 아래에 그대로 표시됩니다.
              한두 문장으로 글을 요약해주세요.
            </p>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              placeholder="예) 코비가 60일 걸리던 개발자 채용을 사흘로 단축한 방법을 소개합니다."
              className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-[14px] leading-[1.6] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-[var(--color-border)] pt-5">
            <span className="text-[11px] font-semibold uppercase text-[#5f6363]">
              /blog/
            </span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                setForm((prev) => ({ ...prev, slug: e.target.value }));
              }}
              placeholder="kobi-changes-hiring"
              className="flex-1 rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 text-[12px] text-[#282828] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>

        <RichEditor
          initialContent={form.content}
          onChange={handleContentChange}
          placeholder="본문을 작성하세요…"
        />
      </div>

      {/* Sidebar: 메타 필드 */}
      <aside className="flex flex-col gap-5">
        {/* 저장 / 삭제 버튼 */}
        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "저장 중…" : mode === "new" ? "글 생성" : "변경사항 저장"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-error)]/20 bg-white px-4 text-[12px] font-semibold text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/5 disabled:opacity-60"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              삭제
            </button>
          )}
        </div>

        {/* 상태 + 카테고리 */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            게시 설정
          </p>

          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              상태
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {POST_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, status: s }))
                  }
                  className={`rounded-md border px-3 py-2 text-[12px] font-medium transition-colors ${
                    form.status === s
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-white text-[#5f6363]"
                  }`}
                >
                  {s === "DRAFT" ? "초안" : "발행"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              카테고리
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value as FormState["category"],
                }))
              }
              className="mt-2 h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] text-[#282828] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {BLOG_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              발행 예약일 (선택)
            </label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, publishedAt: e.target.value }))
              }
              className="mt-2 h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] text-[#282828] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>

        {/* 태그 */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            태그
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {form.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-md bg-[var(--color-primary-light)] px-2 py-1 text-[11px] font-medium text-[var(--color-primary)]"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="태그 입력 후 Enter"
              className="h-9 flex-1 rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex h-9 items-center rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] font-medium text-[#5f6363] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
            >
              추가
            </button>
          </div>
        </div>

        {/* 썸네일 */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            썸네일
          </p>
          {form.thumbnail ? (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.thumbnail}
                alt="썸네일 미리보기"
                className="aspect-video w-full rounded-md border border-[var(--color-border)] object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, thumbnail: "" }))
                }
                className="mt-2 text-[11px] font-medium text-[var(--color-error)] hover:underline"
              >
                제거
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => thumbInputRef.current?.click()}
              className="mt-3 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[#fafbfc] text-[12px] text-[#5f6363] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
            >
              <ImageIcon className="h-5 w-5" />
              썸네일 업로드
            </button>
          )}
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
        </div>

        {/* SEO 메타 */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6363]">
            SEO 메타 정보
          </p>
          <p className="mt-1 text-[11px] leading-[1.5] text-[#9ca3af]">
            검색 엔진 결과에 별도로 노출할 텍스트. 비우면 제목/설명이 사용됩니다.
          </p>
          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              SEO 제목
            </label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, seoTitle: e.target.value }))
              }
              placeholder="검색결과에 표시될 제목 (비우면 본 제목 사용)"
              className="mt-2 h-9 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-[12px] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
          <div className="mt-4">
            <label className="block text-[12px] font-medium text-[#5f6363]">
              SEO 설명
            </label>
            <textarea
              rows={3}
              value={form.seoDesc}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, seoDesc: e.target.value }))
              }
              placeholder="검색 스니펫에 표시될 설명 (160자 권장)"
              className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-[12px] leading-[1.55] text-[#282828] placeholder:text-[#9ca3af] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
