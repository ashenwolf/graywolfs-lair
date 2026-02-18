import { visit } from "unist-util-visit";
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { resolve, extname, dirname, basename } from "node:path";
import lzstring from "lz-string";
const { decompressFromBase64 } = lzstring;
import excalidrawToSvg from "excalidraw-to-svg";

const PUBLIC_DIR = resolve(process.cwd(), "public");
const EXCALIDRAW_OUT_DIR = resolve(PUBLIC_DIR, "assets/excalidraw");

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

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
  let result = svgHtml.replaceAll(
    'font-family="Segoe UI Emoji"',
    'font-family="Virgil, Segoe UI Emoji"',
  );
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

function parseExcalidrawMd(content) {
  const match = content.match(/```compressed-json\n([\s\S]+?)\n```/);
  if (!match) throw new Error("No compressed-json block found");
  const json = decompressFromBase64(match[1].replace(/\n/g, ""));
  if (!json) throw new Error("Failed to decompress excalidraw data");
  return JSON.parse(json);
}

// Convert an excalidraw source file to SVG and write it to public/assets/excalidraw/.
// Returns the public path, e.g. "/assets/excalidraw/diagram.svg".
async function convertExcalidraw(srcPath) {
  const svgName =
    basename(srcPath).replace(/\.excalidraw(\.md)?$/, "") + ".svg";
  const outPath = resolve(EXCALIDRAW_OUT_DIR, svgName);

  const content = readFileSync(srcPath, "utf-8");
  const json = srcPath.endsWith(".excalidraw.md")
    ? parseExcalidrawMd(content)
    : JSON.parse(content);

  const svg = await excalidrawToSvg(json);
  const svgHtml = fixSvgTextElements(await embedFonts(svg.outerHTML));

  mkdirSync(EXCALIDRAW_OUT_DIR, { recursive: true });
  writeFileSync(outPath, svgHtml, "utf-8");

  return `/assets/excalidraw/${svgName}`;
}

// Recursively search for a file by name in a directory
function findFile(dir, filename, publicBase) {
  if (!existsSync(dir)) return null;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const result = findFile(
        resolve(dir, entry.name),
        filename,
        `${publicBase}/${entry.name}`,
      );
      if (result) return result;
    } else if (entry.name === filename) {
      return `${publicBase}/${filename}`;
    }
  }
  return null;
}

// Find an excalidraw source file by stem name, searching from the article's directory
// upward through src/content/. Returns the full fs path or null.
function findExcalidrawSource(name, articleDir) {
  const stem = name.replace(/\.excalidraw(\.md)?$/, "");
  const candidates = [`${stem}.excalidraw.md`, `${stem}.excalidraw`];

  // Search article directory first, then walk up to src/content/
  let dir = articleDir;
  const contentRoot = resolve(process.cwd(), "src/content");

  while (dir.startsWith(contentRoot)) {
    for (const candidate of candidates) {
      const fullPath = resolve(dir, candidate);
      if (existsSync(fullPath)) return fullPath;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export default function remarkObsidianEmbeds() {
  return async (tree, vfile) => {
    const articleDir = vfile?.path ? dirname(vfile.path) : null;
    const promises = [];

    visit(tree, "paragraph", (node, index, parent) => {
      if (!node.children || node.children.length !== 1) return;
      const child = node.children[0];
      if (child.type !== "text") return;

      const text = child.value;
      // Match ![[filename]] or ![[filename|alt text]]
      const match = text.match(/^!\[\[([^\]|]+)(?:\|([^\]]*))?\]\]$/);
      if (!match) return;

      const name = match[1].trim();
      const modifier = match[2]?.trim();
      const isSize = modifier && /^\d+(%|px)?$/.test(modifier);
      const width = isSize ? modifier : undefined;
      const alt = !isSize && modifier ? modifier : name;

      const isExcalidraw =
        name.endsWith(".excalidraw") || name.endsWith(".excalidraw.md");

      if (isExcalidraw) {
        promises.push(
          (async () => {
            const srcPath = articleDir
              ? findExcalidrawSource(name, articleDir)
              : null;

            let src;
            if (srcPath) {
              try {
                src = await convertExcalidraw(srcPath);
              } catch (err) {
                console.error(
                  `remark-obsidian-embeds: failed to convert ![[${name}]]:`,
                  err,
                );
                return;
              }
            } else {
              // Fall back to already-converted SVG in public/
              const svgName = name.replace(/\.excalidraw(\.md)?$/, ".svg");
              src = findFile(
                resolve(PUBLIC_DIR, "assets/excalidraw"),
                svgName,
                "/assets/excalidraw",
              );
            }

            if (!src) {
              console.warn(
                `remark-obsidian-embeds: could not resolve ![[${name}]]`,
              );
              return;
            }

            parent.children[index] = buildImageNode(src, alt, width);
          })(),
        );
      } else if (IMAGE_EXTS.includes(extname(name).toLowerCase())) {
        const src = findFile(resolve(PUBLIC_DIR, "assets"), name, "/assets");
        if (!src) {
          console.warn(
            `remark-obsidian-embeds: could not resolve ![[${name}]]`,
          );
          return;
        }
        parent.children[index] = buildImageNode(src, alt, width);
      }
    });

    await Promise.all(promises);
  };
}

function buildImageNode(src, alt, width) {
  if (width) {
    const w = /^\d+$/.test(width) ? `${width}px` : width;
    return {
      type: "html",
      value: `<img src="${src}" alt="${alt}" width="${w}" />`,
    };
  }
  return { type: "paragraph", children: [{ type: "image", url: src, alt }] };
}
