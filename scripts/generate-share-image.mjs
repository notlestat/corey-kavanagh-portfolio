// Export the 1200 × 630 link-preview image used by Open Graph and Twitter cards.
// sharp is provided by Astro's image tooling. Pass another still as the first
// argument, or regenerate from the Home film's poster frame.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = process.argv[2] ?? fileURLToPath(new URL("../public/work/gallery/moving-09.jpg", import.meta.url));
const outDir = new URL("../public/og/", import.meta.url);
await mkdir(outDir, { recursive: true });
await sharp(source)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(fileURLToPath(new URL("default.jpg", outDir)));
