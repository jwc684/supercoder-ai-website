/**
 * CSV 내보내기 유틸.
 * - RFC 4180 준수 (쌍따옴표 escape, CRLF)
 * - 한글은 Excel 호환을 위해 UTF-8 BOM 추가
 * - 클라이언트에서 Blob + anchor download 트리거까지 한 번에 처리.
 */

type CsvValue = string | number | boolean | Date | null | undefined | string[];

export type CsvColumn<T> = {
  header: string;
  accessor: (row: T) => CsvValue;
};

function escapeCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  let str: string;
  if (Array.isArray(value)) {
    str = value.join("; ");
  } else if (value instanceof Date) {
    str = value.toISOString();
  } else {
    str = String(value);
  }
  // 쌍따옴표, 쉼표, 개행 포함 시 쌍따옴표로 감싸고 내부 " 는 "" 로 escape
  if (/[",\r\n]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * 행 배열을 CSV 문자열로 변환.
 * UTF-8 BOM (\uFEFF) 포함 — Excel 에서 한글이 깨지지 않도록.
 */
export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const headerLine = columns.map((c) => escapeCell(c.header)).join(",");
  const dataLines = rows.map((row) =>
    columns.map((c) => escapeCell(c.accessor(row))).join(","),
  );
  return "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
}

/**
 * 브라우저에서 CSV 파일 다운로드 트리거.
 * Next.js 서버 측에서는 쓰지 말 것 (document 접근).
 */
export function downloadCsv(filename: string, csv: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
