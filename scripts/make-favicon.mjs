// Rasterize the logo SVG at multiple sizes and pack into favicon.ico.
// Usage: node scripts/make-favicon.mjs
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = resolve(import.meta.dirname, "..");
const SVG_PATH = resolve(ROOT, "public/logo.svg");
const ICO_PATH_PUBLIC = resolve(ROOT, "public/favicon.ico");
const ICO_PATH_APP = resolve(ROOT, "app/favicon.ico");

const SIZES = [16, 32, 48, 64];

async function rasterize(svgBuffer, size) {
  // fit=contain keeps the logo aspect ratio centered on a transparent canvas
  return await sharp(svgBuffer, { density: 384 })
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function main() {
  const svg = await readFile(SVG_PATH);
  const pngs = await Promise.all(SIZES.map((s) => rasterize(svg, s)));
  const ico = await pngToIco(pngs);

  await writeFile(ICO_PATH_PUBLIC, ico);
  await writeFile(ICO_PATH_APP, ico);

  console.log(`✅ Wrote ${ico.length} bytes to:`);
  console.log(`   • ${ICO_PATH_PUBLIC}`);
  console.log(`   • ${ICO_PATH_APP}  (Next.js auto-detects)`);
  console.log(`   Sizes embedded: ${SIZES.join(", ")}`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
