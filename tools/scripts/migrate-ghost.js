import { writeFileSync, mkdirSync, createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { parseArgs } from "node:util";
import Database from "better-sqlite3";
import TurndownService from "turndown";

const ROOT = resolve(import.meta.dirname, "../..");
const ARTICLES_DIR = resolve(ROOT, "src/content/articles");
const ASSETS_DIR = resolve(ROOT, "public/assets/images");

const { values } = parseArgs({
  options: {
    db: { type: "string" },
    "ghost-url": { type: "string" },
    "dry-run": { type: "boolean" },
    lang: { type: "string" },
    "add-tags": { type: "string" },
    category: { type: "string" },
  },
});

if (!values.db) {
  console.error(
    "Usage: node tools/scripts/migrate-ghost.js --db path/to/ghost.db [--ghost-url https://example.com] [--dry-run] [--lang ua] [--add-tags tag1,tag2] [--category travel|software-engineering|life]",
  );
  process.exit(1);
}

const isDryRun = values["dry-run"] ?? false;
const overrideLang = values.lang;
const ghostUrl = values["ghost-url"]?.replace(/\/$/, "");
const extraTags = values["add-tags"]
  ? values["add-tags"].split(",").map((t) => t.trim()).filter(Boolean)
  : [];
const overrideCategory = values.category ?? null;

if (isDryRun) console.log("DRY RUN MODE: No files will be written");
if (overrideLang) console.log(`Language override: ${overrideLang}`);
if (extraTags.length) console.log(`Extra tags added to all posts: ${extraTags.join(", ")}`);
if (overrideCategory) console.log(`Category override: ${overrideCategory}`);
if (ghostUrl)
  console.log(
    `Ghost URL: ${ghostUrl} (Ghost-uploaded images will be downloaded)`,
  );
else
  console.warn(
    "Warning: --ghost-url not set, /content/images/ paths rewritten to /assets/images/ — copy Ghost's content/images/ to public/assets/images/ manually",
  );

// Ukrainian transliteration (KMU 2010 standard)
const CYRILLIC_MAP = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ie",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "iu",
  я: "ia",
};

function transliterateSlug(slug) {
  // Ghost encodes Cyrillic slugs as dash-separated hex bytes (e.g. "d0-b7-d0-bf" = "зп")
  slug = slug.replace(/((?:[0-9a-f]{2}-)*[0-9a-f]{2})(?=-|$)/gi, (match) => {
    try {
      const bytes = Buffer.from(match.replace(/-/g, ""), "hex");
      const decoded = bytes.toString("utf-8");
      return /[\u0400-\u04FF]/.test(decoded) ? decoded : match;
    } catch {
      return match;
    }
  });

  return slug
    .split("")
    .map((ch) => CYRILLIC_MAP[ch.toLowerCase()] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dateparts(timestamp) {
  const d = new Date(timestamp);
  return {
    yyyy: d.getFullYear(),
    mm: String(d.getMonth() + 1).padStart(2, "0"),
    dd: String(d.getDate()).padStart(2, "0"),
  };
}

async function downloadImage(url, timestamp) {
  const { yyyy, mm } = dateparts(timestamp);
  const filename = new URL(url).pathname.split("/").pop();
  const publicPath = `/assets/images/${yyyy}/${mm}/${filename}`;

  if (isDryRun) {
    console.log(`  [dry-run] would download: ${url}`);
    return publicPath;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  warning: failed to download ${url} (${res.status})`);
      return null;
    }
    const outDir = resolve(ASSETS_DIR, `${yyyy}/${mm}`);
    mkdirSync(outDir, { recursive: true });
    await pipeline(res.body, createWriteStream(resolve(outDir, filename)));
    return publicPath;
  } catch (err) {
    console.warn(`  warning: failed to download ${url}: ${err.message}`);
    return null;
  }
}

// Resolves a Ghost-local image path (e.g. /content/images/2007/08/foo.jpg).
// With --ghost-url: downloads and returns a /assets/... path.
// Without: rewrites /content/images/ -> /assets/images/ so paths are at least consistent
//          (user must copy Ghost's content/images/ to public/assets/images/ manually).
async function resolveGhostImage(path, timestamp) {
  if (ghostUrl) return downloadImage(ghostUrl + path, timestamp);
  return path.replace("/content/images/", "/assets/images/");
}

const db = new Database(values.db, { readonly: true });
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// Skip pages (Ghost static pages are not blog posts)
const posts = db
  .prepare(
    `SELECT p.id, p.title, p.slug, p.html,
            p.published_at, p.status, p.locale AS language, p.created_at,
            p.feature_image, p.custom_excerpt, p.featured
     FROM posts p
     WHERE p.page = 0
     ORDER BY p.published_at ASC`,
  )
  .all();

const hasTags = db
  .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='tags'`)
  .get();

const tagsByPostId = new Map();
if (hasTags) {
  for (const row of db
    .prepare(
      // Exclude Ghost internal tags (visibility = 'internal', e.g. #feature)
      `SELECT pt.post_id, t.name
       FROM posts_tags pt JOIN tags t ON t.id = pt.tag_id
       WHERE t.visibility = 'public'
       ORDER BY pt.sort_order ASC`,
    )
    .all()) {
    if (!tagsByPostId.has(row.post_id)) tagsByPostId.set(row.post_id, []);
    tagsByPostId.get(row.post_id).push(row.name);
  }
}

const pageCount = db
  .prepare("SELECT COUNT(*) as n FROM posts WHERE page = 1")
  .get().n;
console.log(
  `Found ${posts.length} post(s) in Ghost database (skipping ${pageCount} page(s))`,
);

let converted = 0;

for (const post of posts) {
  if (!post.html) {
    console.warn(`  skipping "${post.title}" — no content`);
    continue;
  }

  let content = turndown.turndown(post.html);
  const date = post.published_at || post.created_at;
  const lang = overrideLang || post.language || "en";
  const tags = tagsByPostId.get(post.id) ?? [];
  if (tags.length === 0) tags.push("life");
  for (const t of extraTags) {
    if (!tags.includes(t)) tags.push(t);
  }
  const isDraft = post.status !== "published";

  // Resolve feature image: download if Ghost-local, keep as-is if external
  let featureImage = post.feature_image ?? null;
  if (featureImage?.startsWith("/content/")) {
    featureImage = await resolveGhostImage(featureImage, date);
  }

  // Rewrite Ghost-local image URLs in content
  for (const [path] of content.matchAll(/\/content\/images\/[^\s"')]+/g)) {
    content = content.replaceAll(path, await resolveGhostImage(path, date));
  }

  const slug = transliterateSlug(post.slug);
  const { yyyy, mm } = dateparts(date);
  const isoDate = new Date(date).toISOString().split("T")[0];

  const frontmatter = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `date: ${isoDate}`,
    `tags: [${tags.map((t) => `"${t}"`).join(", ")}]`,
    `lang: ${lang}`,
    ...(overrideCategory ? [`category: ${overrideCategory}`] : []),
    ...(featureImage ? [`image: "${featureImage}"`] : []),
    ...(post.custom_excerpt
      ? [`description: "${post.custom_excerpt.replace(/"/g, '\\"')}"`]
      : []),
    ...(post.featured ? ["featured: true"] : []),
    ...(isDraft ? ["draft: true"] : []),
    "---",
  ].join("\n");

  const outDir = resolve(ARTICLES_DIR, lang, String(yyyy), mm);
  const outPath = resolve(outDir, `${slug}.md`);

  if (isDryRun) {
    const meta = [
      tags.join(", ") || "no tags",
      featureImage ? "image" : null,
      post.custom_excerpt ? "description" : null,
      post.featured ? "featured" : null,
    ]
      .filter(Boolean)
      .join(", ");
    console.log(
      `  [dry-run] would create: ${lang}/${yyyy}/${mm}/${slug}.md (${meta})`,
    );
  } else {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outPath, frontmatter + "\n\n" + content + "\n", "utf-8");
    console.log(
      `  ${isDraft ? "[draft] " : ""}${lang}/${yyyy}/${mm}/${slug}.md`,
    );
  }
  converted++;
}

db.close();
console.log(`\nMigrated ${converted} of ${posts.length} post(s)`);
