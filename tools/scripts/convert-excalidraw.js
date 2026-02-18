import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, dirname, relative, basename } from "node:path";
import lzstring from "lz-string";
const { decompressFromBase64 } = lzstring;
import excalidrawToSvg from "excalidraw-to-svg";

const FONT_URLS = [
  "https://excalidraw.com/Virgil.woff2",
  "https://excalidraw.com/Cascadia.woff2",
];

const fontCache = new Map();

async function fetchFontAsDataUri(url) {
  if (fontCache.has(url)) return fontCache.get(url);
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const b64 = Buffer.from(buf).toString("base64");
  const dataUri = `data:font/woff2;base64,${b64}`;
  fontCache.set(url, dataUri);
  return dataUri;
}

async function embedFonts(svgHtml) {
  let result = svgHtml;
  for (const url of FONT_URLS) {
    const dataUri = await fetchFontAsDataUri(url);
    result = result.replaceAll(url, dataUri);
  }
  return result;
}

// excalidraw-to-svg/@excalidraw/utils v0.1.2 has two bugs:
// 1. Text elements get font-family="Segoe UI Emoji" instead of the correct Excalidraw font
// 2. Text y attribute is "NaN" — fix it using the font-size as a baseline approximation
function fixSvgTextElements(svgHtml) {
  // Fix font-family: map "Segoe UI Emoji" fallback to Virgil (the default excalidraw handwriting font)
  let result = svgHtml.replaceAll(
    'font-family="Segoe UI Emoji"',
    'font-family="Virgil, Segoe UI Emoji"',
  );
  // Fix y="NaN": replace with font-size value (reasonable baseline for single-line text)
  result = result.replace(
    /(<text\b[^>]*)\by="NaN"([^>]*>)/g,
    (match, before, after) => {
      const fontSizeMatch = match.match(/font-size="([^"]+)"/);
      const fontSize = fontSizeMatch ? parseFloat(fontSizeMatch[1]) : 20;
      return `${before}y="${fontSize}"${after}`;
    },
  );
  return result;
}

const ROOT = resolve(import.meta.dirname, "../..");
const CONTENT_DIR = resolve(ROOT, "src/content");
const ASSETS_DIR = resolve(ROOT, "public/assets/excalidraw");

function findFiles(dir, result = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(fullPath, result);
    } else if (
      entry.name.endsWith(".excalidraw") ||
      entry.name.endsWith(".excalidraw.md")
    ) {
      result.push(fullPath);
    }
  }
  return result;
}

function parseExcalidrawMd(content) {
  const match = content.match(/```compressed-json\n([\s\S]+?)\n```/);
  if (!match) throw new Error("No compressed-json block found");
  const json = decompressFromBase64(match[1].replace(/\n/g, ""));
  if (!json) throw new Error("Failed to decompress excalidraw data");
  return JSON.parse(json);
}

const files = findFiles(CONTENT_DIR);

if (files.length === 0) {
  console.log("convert-excalidraw: no .excalidraw files found");
  process.exit(0);
}

for (const srcPath of files) {
  const rel = relative(CONTENT_DIR, srcPath);
  const svgName = basename(rel).replace(/\.excalidraw(\.md)?$/, "") + ".svg";
  const outDir = resolve(ASSETS_DIR, dirname(rel));
  const outPath = resolve(outDir, svgName);

  console.log(`converting: ${rel} -> ${relative(ROOT, outPath)}`);

  const content = readFileSync(srcPath, "utf-8");
  const json = srcPath.endsWith(".excalidraw.md")
    ? parseExcalidrawMd(content)
    : JSON.parse(content);

  const svg = await excalidrawToSvg(json);
  const svgHtml = fixSvgTextElements(await embedFonts(svg.outerHTML));

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, svgHtml, "utf-8");
}

console.log(`convert-excalidraw: converted ${files.length} file(s)`);
