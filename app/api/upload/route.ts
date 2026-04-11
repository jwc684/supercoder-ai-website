import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/upload — 관리자 전용 이미지 업로드.
 *
 * multipart/form-data 로 `file` 필드 전송.
 * Supabase Storage 의 `blog-images` 버킷에 업로드 후 public URL 반환.
 *
 * 제약:
 *   - 인증 필수 (관리자)
 *   - MIME: image/jpeg, image/png, image/webp, image/gif
 *   - 최대 5MB (버킷 설정과 일치)
 */

const BUCKET = "blog-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "multipart/form-data 형식이 아닙니다" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "file 필드가 비어있거나 파일이 아닙니다" },
      { status: 400 },
    );
  }

  // MIME / 크기 검증
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `허용되지 않는 파일 형식: ${file.type}` },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `파일 크기가 5MB 를 초과했습니다 (${Math.round(file.size / 1024 / 1024)}MB)` },
      { status: 413 },
    );
  }

  // 확장자 결정 (MIME 기반 + 원본 이름 fallback)
  const extFromMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = extFromMime[file.type] ?? "bin";

  // 파일명: YYYY/MM/uuid.ext (연도/월 폴더 구조)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const id = randomUUID();
  const path = `${year}/${month}/${id}.${ext}`;

  try {
    const supabase = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return NextResponse.json(
      {
        ok: true,
        url: publicData.publicUrl,
        path,
        size: file.size,
        mime: file.type,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/upload] failed:", err);
    const msg = err instanceof Error ? err.message : "업로드 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
