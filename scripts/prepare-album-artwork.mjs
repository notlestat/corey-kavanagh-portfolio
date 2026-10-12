import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Web-sized copies only. Original artwork stays outside public assets.
const inputDirectory = process.argv[2];
if (!inputDirectory) throw new Error("Supply the directory containing the eight selected artwork files.");
const outputDirectory = fileURLToPath(new URL("../public/work/album-artwork/", import.meta.url));
const artworks = [
  ["IMG_0611.PNG", "vory-lord-lift-me-up"],
  ["1.png", "unreleased-portrait"],
  ["woo.png", "unreleased-envelope"],
  ["2.png", "unreleased-light"],
  ["3.png", "unreleased-letterforms"],
  ["4.png", "unreleased-collage"],
  ["roll out.png", "unreleased-rollout"],
  ["2 (1).png", "unreleased-silhouette"],
];
await mkdir(outputDirectory, { recursive: true });
for (const [filename, name] of artworks) {
  for (const width of [640, 1200, 2000]) {
    const result = await sharp(path.join(inputDirectory, filename))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 94, effort: 6 })
      .toFile(path.join(outputDirectory, `${name}-${width}.webp`));
    console.log(`${name}-${width}.webp: ${result.width} x ${result.height}, ${result.size} bytes`);
  }
}
