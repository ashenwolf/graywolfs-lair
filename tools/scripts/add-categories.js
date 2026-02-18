#!/usr/bin/env node
/**
 * Adds `category` frontmatter to articles based on their tags.
 *
 * Rules:
 *   - Has tag "life"                                    → category: life
 *   - Has tag containing "software" or "development",
 *     or tag equal to "it" (case-insensitive)           → category: software-engineering
 *
 * Articles that already have a category are skipped unless --force is passed.
 * Use --dry-run to preview changes without writing files.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { parseArgs } from "node:util";

const ROOT = resolve(import.meta.dirname, "../..");
const ARTICLES_DIR = resolve(ROOT, "src/content/articles");

const { values } = parseArgs({
  options: {
    "dry-run": { type: "boolean" },
    force: { type: "boolean" },
  },
});

const isDryRun = values["dry-run"] ?? false;
const force = values.force ?? false;

if (isDryRun) console.log("DRY RUN MODE: No files will be written");
if (force) console.log("FORCE MODE: Existing category fields will be overwritten");

function* walkMd(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkMd(full);
    } else if (entry.isFile() && entry.name.endsWith(".md") && !entry.name.endsWith(".excalidraw.md")) {
      yield full;
    }
  }
}

function parseTags(frontmatter) {
  const match = frontmatter.match(/^tags:\s*\[([^\]]*)\]/m);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, "").toLowerCase());
}

function categoryForTags(tags) {
  for (const tag of tags) {
    if (tag === "it" || tag.includes("software") || tag.includes("development")) {
      return "software-engineering";
    }
  }
  if (tags.includes("life")) return "life";
  return null;
}

let matched = 0;
let skipped = 0;
let updated = 0;

for (const filePath of walkMd(ARTICLES_DIR)) {
  const raw = readFileSync(filePath, "utf-8");

  // Must start with frontmatter
  if (!raw.startsWith("---")) continue;

  const fmEnd = raw.indexOf("---", 3);
  if (fmEnd === -1) continue;

  const frontmatter = raw.slice(3, fmEnd);
  const body = raw.slice(fmEnd + 3);

  const tags = parseTags(frontmatter);
  const category = categoryForTags(tags);

  matched++;

  if (!category) {
    skipped++;
    continue;
  }

  const hasCategory = /^category:/m.test(frontmatter);

  if (hasCategory && !force) {
    console.log(`  skip (already has category): ${filePath.replace(ROOT + "/", "")}`);
    skipped++;
    continue;
  }

  let newFrontmatter;
  if (hasCategory) {
    newFrontmatter = frontmatter.replace(/^category:.*$/m, `category: ${category}`);
  } else {
    // Insert after lang: line if present, otherwise before the closing ---
    if (/^lang:/m.test(frontmatter)) {
      newFrontmatter = frontmatter.replace(/^(lang:.*)$/m, `$1\ncategory: ${category}`);
    } else {
      newFrontmatter = frontmatter.trimEnd() + `\ncategory: ${category}\n`;
    }
  }

  const relPath = filePath.replace(ROOT + "/", "");
  if (isDryRun) {
    console.log(`  [dry-run] would set category: ${category} → ${relPath}`);
  } else {
    writeFileSync(filePath, "---" + newFrontmatter + "---" + body, "utf-8");
    console.log(`  category: ${category} → ${relPath}`);
  }
  updated++;
}

console.log(`\nScanned ${matched} article(s). Updated ${updated}, skipped ${skipped}.`);
