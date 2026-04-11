// 플레이스홀더 브로셔 PDF 생성 (Phase 2 다운로드 테스트용).
// 한 페이지, 제목 + 간단 카피. 실제 디자인된 브로셔는 Phase 5 에서 교체.
// 사용: node scripts/make-brochure-pdf.mjs
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "public/files/supercoder-brochure.pdf");

// 미니 유효 PDF 1.4 — 단일 페이지에 텍스트 포함
const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>endobj
4 0 obj<</Length 248>>stream
BT
/F1 28 Tf
72 720 Td
(Supercoder AI Interviewer) Tj
0 -48 Td
/F1 16 Tf
(Product Brochure - Placeholder) Tj
0 -36 Td
/F1 12 Tf
(Full designed brochure coming in Phase 5.) Tj
0 -24 Td
(Contact: contact@supercoder.ai) Tj
ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000053 00000 n
0000000097 00000 n
0000000185 00000 n
0000000485 00000 n
trailer<</Size 6/Root 1 0 R>>
startxref
548
%%EOF`;

await writeFile(OUT, pdf, "latin1");
console.log(`✅ Wrote placeholder PDF (${pdf.length} bytes) → ${OUT}`);
