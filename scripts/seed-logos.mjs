// /tmp/logos/logo-{1..8}.png 를 Supabase (seo-images/logos/) 에 업로드하고
// Prisma 'logos' 테이블에 초기 row 생성.
//
// 사용: npx dotenv -e .env.local -- node scripts/seed-logos.mjs
//
// 이름은 'Logo 1 ~ 8' 플레이스홀더 — admin 에서 rename 하세요.

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY 미설정");
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false },
});
const prisma = new PrismaClient();

const BUCKET = "seo-images";
const SRC_DIR = "/tmp/logos";

async function main() {
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => /^logo-\d+\.png$/.test(f))
    .sort((a, b) => {
      const na = Number(a.match(/(\d+)/)[1]);
      const nb = Number(b.match(/(\d+)/)[1]);
      return na - nb;
    });

  if (files.length === 0) {
    console.error("❌ /tmp/logos 에 logo-N.png 파일이 없습니다.");
    process.exit(1);
  }

  console.log(`📤 ${files.length} logos → ${BUCKET}/logos/\n`);

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const idx = i + 1;
    const storagePath = `logos/logo-${idx}.png`;
    const localPath = path.join(SRC_DIR, f);
    const buf = fs.readFileSync(localPath);

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buf, {
        contentType: "image/png",
        cacheControl: "31536000",
        upsert: true,
      });
    if (upErr) {
      console.error(`  ❌ upload ${storagePath}:`, upErr.message);
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const row = await prisma.logo.upsert({
      where: { id: `seed-logo-${idx}` },
      update: { url: data.publicUrl, storagePath, sortOrder: idx },
      create: {
        id: `seed-logo-${idx}`,
        name: `Logo ${idx}`,
        url: data.publicUrl,
        storagePath,
        sortOrder: idx,
        isVisible: true,
      },
    });

    console.log(`  ✓ #${idx} "${row.name}" → ${data.publicUrl}`);
  }

  console.log("\n🎉 완료 — /admin/logos 에서 이름 수정·삭제·재정렬 가능.");
}

main()
  .catch((err) => {
    console.error("❌", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
