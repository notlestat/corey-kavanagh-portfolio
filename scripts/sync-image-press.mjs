import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/sync-image-press.mjs /path/to/image-press');
const checkout = resolve(source);
const root = resolve(import.meta.dirname, '..');
const base = '/tools/image-press/';
const files = [
  'index.html', 'src/app.mjs', 'src/print-model.mjs', 'src/style.css',
  'assets/icon.svg', 'assets/fonts/Archivo-Variable.ttf', 'assets/fonts/Archivo-OFL.txt',
  'assets/fonts/RobotoMono-Variable.ttf', 'assets/fonts/RobotoMono-OFL.txt',
  'public/machine.svg', 'public/machine-data.json', 'public/sample-landscape.jpg',
  'vendor/anatomy/kit/iso-kit.mjs', 'vendor/anatomy/kit/iso.css', 'vendor/anatomy/LICENSE',
];
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: checkout, encoding: 'utf8' }).trim();
for (const file of files) {
  const target = resolve(root, 'public/tools/image-press', file);
  await mkdir(dirname(target), { recursive: true });
  if (/\.(html|css|mjs)$/.test(file)) {
    let content = await readFile(resolve(checkout, file), 'utf8');
    content = content.replace(/(["'])\/(assets|src|vendor|public)\//g, `$1${base}$2/`);
    if (file === 'index.html') content = content.replace('href="/"', `href="${base.slice(0, -1)}"`);
    await writeFile(target, content);
  } else await copyFile(resolve(checkout, file), target);
}
await writeFile(resolve(root, 'public/tools/image-press/provenance.json'), JSON.stringify({
  source: 'https://github.com/notlestat/image-press', revision,
  changes: 'Root asset paths and the home link are scoped to /tools/image-press/. Runtime behavior is retained.',
}, null, 2) + '\n');
await writeFile(resolve(root, 'public/tools/image-press/CREDITS.md'), `# Image Press credits\n\nSource: https://github.com/notlestat/image-press/tree/${revision}\n\nThe Anatomy drawing kit is by its original contributors, under the included MIT licence at vendor/anatomy/LICENSE. Source: https://github.com/wheresryan22/anatomy\n\nArchivo and Roboto Mono are included under their SIL Open Font Licenses in assets/fonts/.\n\nThe sample landscape photograph is from Unsplash: https://images.unsplash.com/photo-1470770841072-f978cf4d019e\n\nThis portfolio snapshot adapts only the asset base path and home link. Photographs are processed in browser memory.\n`);
console.log(`Synced Image Press ${revision} to ${base}`);
