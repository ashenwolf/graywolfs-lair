import { resolve, extname, basename } from "node:path";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

const PUBLIC_DIR = resolve(process.cwd(), "public");
const OPTIMIZED_DIR = resolve(PUBLIC_DIR, "assets/optimized");
const MAX_WIDTH = 1200;
const QUALITY = 80;

const cache = new Map();

async function optimizeImage(srcPath) {
  if (cache.has(srcPath)) return cache.get(srcPath);
  if (!existsSync(srcPath)) return null;

  const img = sharp(srcPath);
  const meta = await img.metadata();
  const width = Math.min(meta.width || MAX_WIDTH, MAX_WIDTH);
  const height = Math.round((width / meta.width) * meta.height);

  const hash = createHash("md5").update(`${srcPath}-${width}-${QUALITY}`).digest("hex").slice(0, 8);
  const name = `${basename(srcPath, extname(srcPath))}-${hash}.webp`;
  const outPath = resolve(OPTIMIZED_DIR, name);

  mkdirSync(OPTIMIZED_DIR, { recursive: true });
  if (!existsSync(outPath)) {
    await img.resize(width).webp({ quality: QUALITY }).toFile(outPath);
  }

  const result = { webpPath: `/assets/optimized/${name}`, width, height };
  cache.set(srcPath, result);
  return result;
}

export default function imageOptimization() {
  return {
    name: "image-optimization",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const outDir = dir instanceof URL ? dir.pathname : dir;
        const clientDir = resolve(outDir, "client");
        const htmlDir = existsSync(clientDir) ? clientDir : outDir;
        const htmlFiles = findHtmlFiles(htmlDir);
        let count = 0;

        for (const file of htmlFiles) {
          let html = readFileSync(file, "utf-8");
          const imgRegex = /<img\b([^>]*)\bsrc="(\/assets\/images\/[^"]+\.(png|jpg|jpeg))"([^>]*)>/gi;
          const replacements = [];

          let match;
          while ((match = imgRegex.exec(html)) !== null) {
            const [full, before, src, ext, after] = match;
            const srcPath = resolve(PUBLIC_DIR, src.slice(1));
            const result = await optimizeImage(srcPath);
            if (!result) continue;

            const hasLoading = /loading=/i.test(before + after);
            const hasDecoding = /decoding=/i.test(before + after);
            const hasWidth = /\bwidth=/i.test(before + after);
            const hasHeight = /\bheight=/i.test(before + after);

            let attrs = "";
            if (!hasLoading) attrs += ` loading="lazy"`;
            if (!hasDecoding) attrs += ` decoding="async"`;
            if (!hasWidth) attrs += ` width="${result.width}"`;
            if (!hasHeight) attrs += ` height="${result.height}"`;

            const newTag = `<img${before}src="${result.webpPath}"${after}${attrs}>`;
            replacements.push({ from: full, to: newTag });
            count++;
          }

          if (replacements.length > 0) {
            for (const { from, to } of replacements) {
              html = html.replace(from, to);
            }
            writeFileSync(file, html);
          }
        }

        console.log(`  ✓ Optimized ${count} images across ${htmlFiles.length} pages`);
      },
    },
  };
}

function findHtmlFiles(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.name.endsWith(".html")) results.push(full);
  }
  return results;
}
