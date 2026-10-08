import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// These are real 1440 x 1000, 2x browser captures, not reconstructed UI.
const inputs = process.argv.slice(2);
if (inputs.length !== 3) {
  throw new Error("Supply ORDER, SILENCE and TENSION browser captures, in that order.");
}
const output = fileURLToPath(new URL("../public/work/study-01/", import.meta.url));
await mkdir(output, { recursive: true });
const names = ["order", "silence", "tension"];
for (const [index, input] of inputs.entries()) {
  const metadata = await sharp(input).metadata();
  if (metadata.width !== 2880 || metadata.height !== 2000) {
    throw new Error("Expected an unaltered 2880 x 2000 desktop capture.");
  }
  await sharp(input)
    .extract({ left: 1096, top: 457, width: 840, height: 1120 })
    .webp({ quality: 88 })
    .toFile(path.join(output, `${names[index]}.webp`));
}
await sharp(inputs[0])
  .resize({ width: 2000 })
  .webp({ quality: 88 })
  .toFile(path.join(output, "interface.webp"));
