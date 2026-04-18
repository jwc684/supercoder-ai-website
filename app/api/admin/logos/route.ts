import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET  /api/admin/logos — 관리자용 전체 로고 리스트 (비공개 포함).
 * POST /api/admin/logos — 신규 로고 업로드 (multipart/form-data, 'file' + 'name').
 */

const BUCKET = "seo-images";
const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB — 로고는 작게

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logos = await prisma.logo.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ ok: true, logos });
  } catch (err) {
    console.error("[api/admin/logos] GET failed:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

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
  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "'file' 필드가 필요합니다" },
      { status: 400 },
    );
  }
  if (!name) {
    return NextResponse.json(
      { error: "업체명을 입력해주세요" },
      { status: 400 },
    );
  }
  if (!ALLOWED_MIMES.includes(file.type)) {
    return NextResponse.json(
      { error: `지원되지 않는 형식: ${file.type}. PNG/JPEG/WebP/SVG 만 허용` },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "파일이 너무 큽니다 (최대 2MB)" },
      { status: 400 },
    );
  }

  const ext = file.type.split("/")[1]?.replace("svg+xml", "svg") ?? "png";
  const uuid = randomUUID();
  const storagePath = `logos/${uuid}.${ext}`;

  try {
    const supabase = createAdminClient();
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, bytes, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });
    if (uploadErr) {
      console.error("[api/admin/logos] upload failed:", uploadErr);
      return NextResponse.json(
        { error: `Storage 업로드 실패: ${uploadErr.message}` },
        { status: 500 },
      );
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    // 신규 로고는 sortOrder 맨 뒤로.
    const max = await prisma.logo.aggregate({ _max: { sortOrder: true } });
    const nextOrder = (max._max.sortOrder ?? 0) + 1;

    const created = await prisma.logo.create({
      data: {
        name,
        url: pub.publicUrl,
        storagePath,
        sortOrder: nextOrder,
        isVisible: true,
      },
    });

    return NextResponse.json({ ok: true, logo: created }, { status: 201 });
  } catch (err) {
    console.error("[api/admin/logos] POST failed:", err);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}
