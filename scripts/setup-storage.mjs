// Supabase Storage 버킷 생성/업데이트 스크립트.
// 사용: npx dotenv -e .env.local -- node scripts/setup-storage.mjs
//
// blog-images 버킷을 public read 로 설정.
// 이미 존재하면 설정만 업데이트.

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

const BUCKET_NAME = "blog-images";

async function main() {
  console.log(`🔍 버킷 '${BUCKET_NAME}' 확인…`);

  const { data: existing } = await supabase.storage.getBucket(BUCKET_NAME);

  if (existing) {
    console.log(`✅ 이미 존재. public=${existing.public}`);
    if (!existing.public) {
      console.log("🔧 public 으로 전환…");
      const { error } = await supabase.storage.updateBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: "5MB",
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      });
      if (error) throw error;
      console.log("✅ public read 설정 완료");
    }
    return;
  }

  console.log(`➕ 신규 생성…`);
  const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });
  if (error) throw error;
  console.log(`✅ 버킷 '${BUCKET_NAME}' 생성 완료 (public, 5MB 제한, jpeg/png/webp/gif)`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
