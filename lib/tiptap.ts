import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Youtube } from "@tiptap/extension-youtube";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { generateHTML as tiptapGenerateHTML } from "@tiptap/html";
import { slugify } from "@/lib/validations";

/**
 * Tiptap 공유 extensions.
 * - RichEditor (client) + generateHtmlFromJson (server) 가 동일 extensions 사용
 * - Placeholder 만 편집기 전용이므로 여기선 제외
 */
const lowlight = createLowlight(common);

export const tiptapExtensions = [
  StarterKit.configure({ codeBlock: false }),
  Image,
  Link.configure({ openOnClick: false, autolink: true }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  Youtube,
  CodeBlockLowlight.configure({ lowlight }),
];

export type TiptapDoc = {
  type: "doc";
  content?: unknown[];
};

export type TocEntry = {
  level: number;
  text: string;
  id: string;
};

/**
 * Tiptap JSON → HTML 문자열 + TOC 추출.
 * 헤딩에 id 를 주입해 앵커 링크 가능.
 */
export function renderTiptap(json: object): { html: string; toc: TocEntry[] } {
  // 1. JSON 을 HTML 로 변환
  const rawHtml = tiptapGenerateHTML(json, tiptapExtensions);

  // 2. 헤딩에 id 주입하면서 TOC 추출
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();

  const html = rawHtml.replace(
    /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (_m, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr);
      // 내부 태그 제거하여 순수 텍스트만 추출
      const text = inner.replace(/<[^>]*>/g, "").trim();
      if (!text) return `<h${level}${attrs}>${inner}</h${level}>`;

      // slug 생성 + 중복 처리
      const base = slugify(text) || `heading-${toc.length + 1}`;
      const count = seen.get(base) ?? 0;
      const id = count === 0 ? base : `${base}-${count}`;
      seen.set(base, count + 1);

      toc.push({ level, text, id });
      return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
    },
  );

  return { html, toc };
}

/**
 * 본문 JSON 에서 첫 N 글자 plain text 추출 (요약 자동 생성용).
 */
export function extractPlainText(json: unknown, maxLen = 160): string {
  let out = "";
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as { type?: string; text?: string; content?: unknown[] };
    if (n.type === "text" && typeof n.text === "string") {
      out += n.text + " ";
    }
    if (Array.isArray(n.content)) n.content.forEach(walk);
  };
  walk(json);
  out = out.trim().replace(/\s+/g, " ");
  if (out.length <= maxLen) return out;
  return out.slice(0, maxLen).trimEnd() + "…";
}

/**
 * 대략적인 읽기 시간 (분 단위).
 * 한글 기준 분당 600자, 영문 분당 200단어 정도로 rough 계산.
 */
export function estimateReadingTime(json: unknown): number {
  const text = extractPlainText(json, Number.MAX_SAFE_INTEGER);
  if (!text) return 1;
  // 한글 문자 기준
  const charCount = text.length;
  const minutes = Math.max(1, Math.round(charCount / 500));
  return minutes;
}
