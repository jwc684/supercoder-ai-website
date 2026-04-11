// Supabase Storage 'brochures' 버킷 생성/업데이트 스크립트.
// 사용: npx dotenv -e .env.local -- node scripts/setup-brochures-bucket.mjs
//
// 서비스 소개서 PDF 전용 버킷. public read.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SECRET_KEY 가 없습니다.");
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false },
});

const BUCKET_NAME = "brochures";
const SIZE_LIMIT = "20MB";
const ALLOWED_MIMES = ["application/pdf"];

async function main() {
  console.log(`🔍 버킷 '${BUCKET_NAME}' 확인…`);

  const { data: existing } = await supabase.storage.getBucket(BUCKET_NAME);

  if (existing) {
    console.log(`✅ 이미 존재. public=${existing.public}`);
    console.log("🔧 설정 동기화…");
    const { error } = await supabase.storage.updateBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: SIZE_LIMIT,
      allowedMimeTypes: ALLOWED_MIMES,
    });
    if (error) throw error;
    console.log("✅ 설정 완료 (public, 20MB, application/pdf)");
    return;
  }

  console.log(`➕ 신규 생성…`);
  const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: SIZE_LIMIT,
    allowedMimeTypes: ALLOWED_MIMES,
  });
  if (error) throw error;
  console.log(
    `✅ 버킷 '${BUCKET_NAME}' 생성 완료 (public, 20MB 제한, application/pdf)`,
  );
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
