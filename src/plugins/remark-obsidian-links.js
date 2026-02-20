/**
 * remark-obsidian-links
 *
 * Converts Obsidian wiki links ([[filename]] or [[filename|display text]])
 * to proper site URLs using the same date-based slug structure as the rest
 * of the site (/YYYY/MM/DD/slug).
 *
 * The slug is derived using github-slugger on the filename stem, which matches
 * exactly what Astro's glob loader does when building collection entry IDs.
 */

import { visit } from "unist-util-visit";
import { findAndReplace } from "mdast-util-find-and-replace";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve, basename } from "node:path";
import { slug as githubSlug } from "github-slugger";
import yaml from "js-yaml";

const CONTENT_DIR = resolve(process.cwd(), "src/content/articles");

// Cache: filename stem -> { url, filePath } | null
const linkCache = new Map();

/**
 * Recursively search for a .md file whose stem slugifies to the same value
 * as the given slugified target. This handles apostrophe variants and other
 * Unicode differences between what Obsidian writes in links vs actual filenames.
 * Returns the full fs path, or null.
 */
function findArticleFile(dir, slugifiedTarget) {
  if (!existsSync(dir)) return null;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const result = findArticleFile(resolve(dir, entry.name), slugifiedTarget);
      if (result) return result;
    } else if (entry.name.endsWith(".md") && !entry.name.endsWith(".excalidraw.md")) {
      const entryStem = basename(entry.name, ".md");
      if (githubSlug(entryStem) === slugifiedTarget) {
        return resolve(dir, entry.name);
      }
    }
  }
  return null;
}

/**
 * Given a wiki link target (e.g. "My Article" or "My Article.md"),
 * find the corresponding article and return its URL, or null if not found.
 */
function resolveWikiLink(target) {
  // Strip .md extension if present
  const stem = target.endsWith(".md") ? target.slice(0, -3) : target;
  // Slugify up front — used both for cache key, file lookup, and the URL
  const urlSlug = githubSlug(stem);

  if (linkCache.has(urlSlug)) return linkCache.get(urlSlug);

  const filePath = findArticleFile(CONTENT_DIR, urlSlug);
  if (!filePath) {
    linkCache.set(urlSlug, null);
    return null;
  }

  let date;
  try {
    const content = readFileSync(filePath, "utf-8");
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const data = fmMatch ? yaml.load(fmMatch[1]) : {};
    date = data?.date ? new Date(data.date) : null;
  } catch {
    linkCache.set(urlSlug, null);
    return null;
  }

  if (!date || isNaN(date.getTime())) {
    linkCache.set(urlSlug, null);
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const url = `/${year}/${month}/${day}/${urlSlug}`;

  linkCache.set(urlSlug, url);
  return url;
}

// Matches [[target]] or [[target|display text]]
// Does NOT match ![[...]] (those are embeds handled by remark-obsidian-embeds)
const WIKI_LINK_RE = /(?<!!)\[\[([^\]|]+?)(?:\|([^\]]*?))?\]\]/g;

export default function remarkObsidianLinks() {
  return (tree) => {
    // Handle Obsidian wiki links: [[filename]] or [[filename|display]]
    findAndReplace(tree, [
      [
        WIKI_LINK_RE,
        (match, target, displayText) => {
          const text = (displayText ?? target).trim();
          const url = resolveWikiLink(target.trim());

          if (!url) {
            console.warn(
              `remark-obsidian-links: could not resolve [[${target.trim()}]] (slug: ${githubSlug(target.trim())})`,
            );
            return { type: "text", value: text };
          }

          return {
            type: "link",
            url,
            children: [{ type: "text", value: text }],
          };
        },
      ],
    ]);

    // Handle standard markdown links where the href is a local .md filename
    // (Obsidian generates these as percent-encoded paths like "My Article.md")
    visit(tree, "link", (node) => {
      const href = node.url;
      if (!href || href.startsWith("http") || href.startsWith("/") || href.startsWith("#")) return;

      const decoded = decodeURIComponent(href);
      if (!decoded.endsWith(".md")) return;

      const stem = decoded.slice(0, -3);
      const url = resolveWikiLink(stem);

      if (!url) {
        console.warn(
          `remark-obsidian-links: could not resolve link to "${decoded}"`,
        );
        return;
      }

      node.url = url;
    });
  };
}
