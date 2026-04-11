// Supabase Storage 'seo-images' 버킷 생성/업데이트.
// 사용: npx dotenv -e .env.local -- node scripts/setup-seo-images-bucket.mjs
//
// 페이지별 Social Preview 이미지 (1200x630) 전용 public 버킷.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SECRET_KEY 가 없습니다.",
  );
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false },
});

const BUCKET_NAME = "seo-images";
const SIZE_LIMIT = "5MB";
const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

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
    console.log("✅ 설정 완료 (public, 5MB, image/jpeg+png+webp)");
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
    `✅ 버킷 '${BUCKET_NAME}' 생성 완료 (public, 5MB, image/jpeg+png+webp)`,
  );
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
