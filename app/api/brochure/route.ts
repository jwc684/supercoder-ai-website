import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "brochures";
const ALLOWED_MIMES = ["application/pdf"] as const;
const MAX_SIZE = 20 * 1024 * 1024; // 20MB — 버킷 설정과 일치

/**
 * GET /api/brochure — 공개용, 현재(최신) 브로셔 반환.
 * 없으면 404 (공개 /download 플로우는 이 API 를 optional 로 취급하고
 * fallback 으로 정적 /files/supercoder-brochure.pdf 사용).
 */
export async function GET() {
  try {
    const latest = await prisma.brochure.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        url: true,
        size: true,
        mime: true,
        createdAt: true,
      },
    });
    if (!latest) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, brochure: latest });
  } catch (err) {
    console.error("[api/brochure] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

/**
 * POST /api/brochure — 관리자 전용, multipart/form-data 로 PDF 업로드.
 * Supabase Storage 'brochures' 버킷에 저장 후 DB 레코드 생성.
 * 최신 레코드가 "현재 활성" 브로셔 역할.
 */
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
      { error: "multipart/form-data 요청이 아닙니다" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "'file' 필드가 필요합니다" },
      { status: 400 },
    );
  }

  if (!ALLOWED_MIMES.includes(file.type as (typeof ALLOWED_MIMES)[number])) {
    return NextResponse.json(
      { error: `지원되지 않는 파일 형식 (PDF 만 허용): ${file.type}` },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `파일이 너무 큽니다 (최대 20MB)` },
      { status: 400 },
    );
  }

  // Storage path: YYYY/MM/uuid.pdf
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const uuid = randomUUID();
  const storagePath = `${yyyy}/${mm}/${uuid}.pdf`;

  try {
    const supabase = createAdminClient();
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, bytes, {
        contentType: file.type,
        upsert: false,
      });
    if (uploadError) {
      console.error("[api/brochure] storage upload failed:", uploadError);
      return NextResponse.json(
        { error: `Storage 업로드 실패: ${uploadError.message}` },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const created = await prisma.brochure.create({
      data: {
        filename: file.name || "brochure.pdf",
        url: publicUrlData.publicUrl,
        path: storagePath,
        size: file.size,
        mime: file.type,
      },
    });

    return NextResponse.json(
      { ok: true, brochure: created },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/brochure] POST failed:", err);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}
