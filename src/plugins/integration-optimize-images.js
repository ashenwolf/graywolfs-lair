import { resolve, extname, basename } from "node:path";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync, rmdirSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

const PUBLIC_DIR = resolve(process.cwd(), "public");
const MAX_WIDTH = 1200;
const QUALITY = 80;

const cache = new Map();

async function optimizeImage(srcPath, outputDir) {
  if (cache.has(srcPath)) return cache.get(srcPath);
  if (!existsSync(srcPath)) return null;

  const img = sharp(srcPath);
  const meta = await img.metadata();
  const width = Math.min(meta.width || MAX_WIDTH, MAX_WIDTH);
  const height = Math.round((width / meta.width) * meta.height);

  const hash = createHash("md5").update(`${srcPath}-${width}-${QUALITY}`).digest("hex").slice(0, 8);
  const name = `${basename(srcPath, extname(srcPath))}-${hash}.webp`;
  const optimizedDir = resolve(outputDir, "assets/optimized");

  mkdirSync(optimizedDir, { recursive: true });
  const outPath = resolve(optimizedDir, name);
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
          let modified = false;

          // Rewrite <img> tags
          const imgRegex = /<img\b([^>]*)\bsrc="(\/assets\/images\/[^"]+\.(png|jpg|jpeg))"([^>]*)>/gi;
          let match;
          while ((match = imgRegex.exec(html)) !== null) {
            const [full, before, src, ext, after] = match;
            const srcPath = resolve(PUBLIC_DIR, src.slice(1));
            const result = await optimizeImage(srcPath, htmlDir);
            if (!result) continue;

            const hasLoading = /loading=/i.test(before + after);
            const hasDecoding = /decoding=/i.test(before + after);
            const hasWidth = /\bwidth=/i.test(before + after);
            const hasHeight = /\bheight=/i.test(before + after);
            const hasFetchpriority = /fetchpriority=/i.test(before + after);

            let attrs = "";
            if (!hasLoading) attrs += ` loading="lazy"`;
            if (!hasDecoding && !hasFetchpriority) attrs += ` decoding="async"`;
            if (!hasWidth) attrs += ` width="${result.width}"`;
            if (!hasHeight) attrs += ` height="${result.height}"`;

            const newTag = `<img${before}src="${result.webpPath}"${after}${attrs}>`;
            html = html.replace(full, newTag);
            modified = true;
            count++;
          }

          // Rewrite og:image and twitter:image meta tags
          const metaRegex = /<meta\b[^>]*(?:property="og:image"|name="twitter:image")[^>]*content="([^"]*\/assets\/images\/[^"]+\.(png|jpg|jpeg))"[^>]*>/gi;
          let metaMatch;
          while ((metaMatch = metaRegex.exec(html)) !== null) {
            const [fullMeta, contentUrl, ext] = metaMatch;
            // Extract the path portion (strip domain if present)
            const pathMatch = contentUrl.match(/\/assets\/images\/[^"]+\.(png|jpg|jpeg)$/i);
            if (!pathMatch) continue;
            const localPath = pathMatch[0];
            const srcPath = resolve(PUBLIC_DIR, localPath.slice(1));
            const result = await optimizeImage(srcPath, htmlDir);
            if (!result) continue;

            const domain = contentUrl.replace(localPath, "");
            const newMeta = fullMeta.replace(contentUrl, domain + result.webpPath);
            html = html.replace(fullMeta, newMeta);
            modified = true;
          }

          if (modified) {
            writeFileSync(file, html);
          }
        }

        // Remove unused original PNG/JPG from dist/assets/images/ and dist/_astro/
        const distImagesDir = resolve(htmlDir, "assets/images");
        const distAstroDir = resolve(htmlDir, "_astro");
        let removed = 0;
        if (existsSync(distImagesDir)) removed += removeRasterImages(distImagesDir);
        if (existsSync(distAstroDir)) removed += removeRasterImages(distAstroDir);
        console.log(`  ✓ Optimized ${count} images, removed ${removed} unused originals`);
      },
    },
  };
}

function removeRasterImages(dir) {
  let removed = 0;
  if (!existsSync(dir)) return removed;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      removed += removeRasterImages(full);
      // Remove empty directories
      if (readdirSync(full).length === 0) rmdirSync(full);
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      unlinkSync(full);
      removed++;
    }
  }
  return removed;
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
