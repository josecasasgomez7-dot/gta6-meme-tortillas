// GTA 6 meme entry for make.fun (gta6-meme-x-01). Node 22, standard library only.
//
// The entry is the X post itself: this program's only job is to hand the gate
// the post's address, by copying POST.json from the repository root into the
// output directory. The house then reads the post from X (its first picture
// and its text) and hands that to the judge. Run it the way the grader does:
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

// Validate POST.json before handing it to the gate: it must be valid JSON
// with a string `url` pointing at an X status, so a bad entry fails loudly
// here instead of silently reaching the judge with no post to read.
let postUrl: unknown;
try {
  postUrl = (JSON.parse(readFileSync(source, 'utf8')) as { url?: unknown }).url;
} catch (error) {
  console.error(`Invalid POST.json at ${source}: ${(error as Error).message}`);
  process.exit(1);
}

if (typeof postUrl !== 'string' || !/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(postUrl)) {
  console.error(`Invalid POST.json at ${source}: "url" must be an X status URL (https://x.com/<handle>/status/<id>), got: ${JSON.stringify(postUrl)}`);
  process.exit(1);
}

console.log(`Handing post to the gate: ${postUrl}`);

try {
  copyFileSync(source, target);
} catch (error) {
  console.error(`Could not copy ${source} to ${target}: ${(error as Error).message}`);
  process.exit(1);
}
