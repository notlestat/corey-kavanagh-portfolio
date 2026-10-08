// Export web icons without changing the original CK artwork or header logo.
// sharp is provided by Astro's image tooling. Pass higher-resolution artwork
// as the first argument, or regenerate from the checked-in header mark.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = process.argv[2] ?? fileURLToPath(new URL("../public/ck-logo.png", import.meta.url));
const publicDir = new URL("../public/", import.meta.url);
const background = "#eeefeb";
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width, top = info.height, right = -1, bottom = -1;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * info.channels + 3] > 16) {
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
}
if (right < left || bottom < top) throw new Error("CK artwork contains no visible pixels.");
const artwork = await sharp(source).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).png().toBuffer();

async function render(size, paddingFraction = .04) {
  const padding = Math.max(1, Math.round(size * paddingFraction));
  const { data: mark, info: markInfo } = await sharp(artwork)
    .resize(size - padding * 2, size - padding * 2, { fit: "inside", kernel: "lanczos3" })
    .png().toBuffer({ resolveWithObject: true });
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, left: Math.round((size - markInfo.width) / 2), top: Math.round((size - markInfo.height) / 2) }])
    .png().toBuffer();
}

const browserSizes = [16, 32, 48, 96];
const images = new Map();
for (const size of browserSizes) {
  const png = await render(size);
  images.set(size, png);
  await writeFile(new URL(`favicon-${size}.png`, publicDir), png);
}
// iOS supplies the corner mask. Keep the export opaque and square.
await writeFile(new URL("apple-touch-icon.png", publicDir), await render(180, .1));

// ICO uses conventional uncompressed BGRA bitmaps, including an AND mask.
// This supports browser fallback without relying on PNG-in-ICO decoding.
const icoSizes = [16, 32, 48];
const directory = Buffer.alloc(6 + icoSizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(icoSizes.length, 4);
const bitmaps = [];
let offset = directory.length;
for (const [index, size] of icoSizes.entries()) {
  const pixels = await sharp(images.get(size)).ensureAlpha().raw().toBuffer();
  const rowBytes = size * 4;
  const maskBytes = Math.ceil(size / 32) * 4 * size;
  const bitmap = Buffer.alloc(40 + rowBytes * size + maskBytes);
  bitmap.writeUInt32LE(40, 0);
  bitmap.writeInt32LE(size, 4);
  bitmap.writeInt32LE(size * 2, 8);
  bitmap.writeUInt16LE(1, 12);
  bitmap.writeUInt16LE(32, 14);
  bitmap.writeUInt32LE(rowBytes * size + maskBytes, 20);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dest = 40 + ((size - 1 - y) * size + x) * 4;
      bitmap[dest] = pixels[src + 2]; bitmap[dest + 1] = pixels[src + 1];
      bitmap[dest + 2] = pixels[src]; bitmap[dest + 3] = pixels[src + 3];
    }
  }
  const entry = 6 + index * 16;
  directory[entry] = size; directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(bitmap.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  bitmaps.push(bitmap);
  offset += bitmap.length;
}
await writeFile(new URL("favicon.ico", publicDir), Buffer.concat([directory, ...bitmaps]));
console.log("Generated square 16/32/48/96px favicons, multi-size ICO and 180px Apple touch icon.");
