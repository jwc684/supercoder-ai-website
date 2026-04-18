// 이메일 템플릿 로고를 Supabase Storage 에 업로드.
// 사용: npx dotenv -e .env.local -- node scripts/upload-email-logo.mjs
//
// 'seo-images' 버킷 (public, image/png 허용) 의 email/ 경로에 저장.
// 배포된 버킷 URL 을 stdout 에 출력 — lib/email/send-brochure.ts 에서 그 URL 사용.

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY 가 없습니다.");
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false },
});

const BUCKET = "seo-images";
const STORAGE_PATH = "email/logo-horizontal-email.png";
const LOCAL_FILE = path.resolve("public/logo-horizontal-email.png");

async function main() {
  if (!fs.existsSync(LOCAL_FILE)) {
    console.error(`❌ 로컬 파일 없음: ${LOCAL_FILE}`);
    process.exit(1);
  }

  const file = fs.readFileSync(LOCAL_FILE);
  console.log(`📤 ${LOCAL_FILE} → ${BUCKET}/${STORAGE_PATH}`);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(STORAGE_PATH, file, {
      contentType: "image/png",
      cacheControl: "31536000", // 1년 캐시 — 로고는 자주 안 바뀌므로.
      upsert: true,
    });

  if (error) {
    console.error("❌ 업로드 실패:", error.message);
    process.exit(1);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(STORAGE_PATH);
  console.log(`\n✅ 업로드 완료. Public URL:\n   ${data.publicUrl}\n`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
