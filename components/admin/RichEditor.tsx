"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Youtube } from "@tiptap/extension-youtube";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Film as YoutubeIcon,
  Code2,
  Minus,
} from "lucide-react";

const lowlight = createLowlight(common);

/**
 * RichEditor — Tiptap 기반 재사용 가능한 리치 텍스트 에디터.
 * 사용: BlogPost 본문 편집 (new / edit) + Terms 본문 편집
 *
 * Extensions: StarterKit + Image + Link + Table + CodeBlockLowlight + Placeholder + Youtube
 * Output: Tiptap JSON (에디터 내부 표현, Prisma `content Json` 필드에 저장)
 */
export type RichEditorContent = object; // Tiptap JSON doc

type RichEditorProps = {
  initialContent?: RichEditorContent | null;
  onChange?: (json: RichEditorContent) => void;
  placeholder?: string;
};

export function RichEditor({
  initialContent,
  onChange,
  placeholder = "본문을 작성하세요…",
}: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // SSR 경고 방지
    extensions: [
      StarterKit.configure({
        codeBlock: false, // lowlight 버전 사용
      }),
      Image.configure({ HTMLAttributes: { class: "rich-img" } }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-[var(--color-primary)] underline underline-offset-2",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        inline: false,
        width: 640,
        height: 360,
        HTMLAttributes: { class: "rich-youtube" },
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: initialContent ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[400px] max-w-none px-5 py-4 text-[15px] leading-[1.7] text-[#282828] focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[500px] animate-pulse rounded-xl border border-[var(--color-border)] bg-[#fafbfc]" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────
function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = ""; // 같은 파일 재선택 가능

      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드 가능합니다.");
        return;
      }

      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "업로드 실패");
        editor
          .chain()
          .focus()
          .setImage({ src: json.url, alt: file.name })
          .run();
        toast.success("이미지가 삽입되었습니다.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "알 수 없는 오류";
        toast.error(`이미지 업로드 실패: ${msg}`);
      }
    },
    [editor],
  );

  const handleAddLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL 을 입력하세요:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleAddYoutube = useCallback(() => {
    const url = window.prompt("YouTube URL 을 입력하세요:");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const handleAddTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] bg-[#fafbfc] px-2 py-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Btn
        icon={Undo}
        title="실행 취소"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <Btn
        icon={Redo}
        title="다시 실행"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />
      <Divider />

      <Btn
        icon={Heading1}
        title="제목 1"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editor.isActive("heading", { level: 1 })}
      />
      <Btn
        icon={Heading2}
        title="제목 2"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
      />
      <Btn
        icon={Heading3}
        title="제목 3"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        active={editor.isActive("heading", { level: 3 })}
      />
      <Divider />

      <Btn
        icon={Bold}
        title="굵게"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      />
      <Btn
        icon={Italic}
        title="기울임"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      />
      <Btn
        icon={Strikethrough}
        title="취소선"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      />
      <Btn
        icon={Code}
        title="인라인 코드"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
      />
      <Divider />

      <Btn
        icon={List}
        title="순서 없는 목록"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      />
      <Btn
        icon={ListOrdered}
        title="순서 있는 목록"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      />
      <Btn
        icon={Quote}
        title="인용"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      />
      <Btn
        icon={Code2}
        title="코드 블록"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
      />
      <Btn
        icon={Minus}
        title="구분선"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <Divider />

      <Btn icon={LinkIcon} title="링크" onClick={handleAddLink} />
      <Btn icon={ImageIcon} title="이미지 업로드" onClick={handleUploadClick} />
      <Btn icon={TableIcon} title="표 삽입" onClick={handleAddTable} />
      <Btn icon={YoutubeIcon} title="YouTube 삽입" onClick={handleAddYoutube} />
    </div>
  );
}

function Btn({
  icon: Icon,
  title,
  onClick,
  active,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-[#5f6363] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
          : "hover:bg-[#f0f1f3] hover:text-[#282828]"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />;
}
