# Gulenok's blog

A bilingual (English + Ukrainian) static blog built with Astro 5, deployed to Cloudflare Pages.

## Stack

- **Astro 5** — static site generation
- **Tailwind CSS v4** — configured in `src/styles/global.css` via `@theme`/`@utility`/`@layer`; no `tailwind.config.*` file
- **Cloudflare Pages** via `@astrojs/cloudflare` adapter
- Content authored in **Markdown**, edited in **Obsidian**

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build (clears Astro cache, then astro build)
npm run preview      # Preview production build locally
```

## Folder structure

```
src/
  content/
    articles/
      en/              # English articles (organized by year/month)
      ua/              # Ukrainian articles (organized by year/month)
    pages/             # Static pages (about, etc.)
  pages/               # Astro route files
    ua/                # Ukrainian routes (/ua/*)
  layouts/             # Base.astro, Article.astro
  components/          # UI components
  plugins/             # Custom remark plugins
  styles/              # global.css (Tailwind theme)
  utils/               # articleUrls.ts
public/
  assets/              # Static images (YYYY/MM/DD/)
    excalidraw/        # Generated at build time (gitignored)
    mermaid/           # Generated at build time (gitignored)
tools/
  scripts/             # Utility and migration scripts (not deployed)
```

## Routing

The site is bilingual. English routes are at the root; Ukrainian routes are under `/ua/`:

| Route | File |
|-------|------|
| `/` | `src/pages/index.astro` |
| `/tags` | `src/pages/tags/index.astro` |
| `/tags/[tag]` | `src/pages/tags/[tag].astro` |
| `/category/[category]` | `src/pages/category/[category].astro` |
| `/cv` | `src/pages/cv.astro` |
| `/photography` | `src/pages/photography/index.astro` |
| `/YYYY/MM/DD/slug` | `src/pages/[...slug].astro` |
| `/ua/*` | mirrors the above under `src/pages/ua/` |

Article URLs are date-based (`/YYYY/MM/DD/slug`), generated from frontmatter `date` and filename. See `src/utils/articleUrls.ts`.

## Content collections

Defined in `src/content.config.ts`:

**`articles`** — `src/content/articles/**/*.md` (excludes `*.excalidraw.md`)
- `title` (required), `date` (required), `tags` (default `[]`), `lang` (`en`|`ua`, default `en`), `draft` (default `false`), `description`, `category` (`software-engineering`|`travel`|`life`), `image`

**`pages`** — `src/content/pages/**/*.md`
- `title` (required)

## Custom remark plugins

**`remark-obsidian-embeds.js`** — resolves Obsidian `![[filename]]` transclusions:
- Regular images → `<img>` tags (searched recursively in `public/assets/`)
- `![[name|500px]]` → image with width set
- `![[name.excalidraw]]` → converts the source file to SVG at build time (see below)

**`remark-mermaid.js`** — renders ` ```mermaid ` blocks to static SVGs using `beautiful-mermaid`, output to `public/assets/mermaid/` with content-hashed filenames.

## Excalidraw pipeline

When `remark-obsidian-embeds.js` encounters a `![[name.excalidraw]]` embed it:
1. Locates the `.excalidraw.md` source file (searches from article's directory upward through `src/content/`)
2. Decompresses the embedded Excalidraw JSON
3. Converts to SVG via `excalidraw-to-svg`, embeds fonts as base64 data URIs
4. Applies two upstream bug fixes (wrong font-family, `y="NaN"` on text elements)
5. Writes the result to `public/assets/excalidraw/`

The standalone `tools/scripts/convert-excalidraw.js` still exists as a utility but is not part of the build.

## Tools

**`tools/scripts/migrate-ghost.js`** — one-time Ghost 0.x → Astro migration:
```bash
node tools/scripts/migrate-ghost.js --db path/to/ghost.db [--ghost-url URL] [--dry-run] [--lang en|ua] [--add-tags tag1,tag2] [--category software-engineering|travel|life]
```
Reads the Ghost SQLite file, converts HTML to Markdown via `turndown`, downloads images, and writes article Markdown files with frontmatter.

**`tools/scripts/add-categories.js`** — backfills `category` frontmatter on existing articles based on tags:
```bash
node tools/scripts/add-categories.js [--dry-run] [--force]
```

**`tools/scripts/convert-excalidraw.js`** — standalone Excalidraw → SVG converter (same logic as the remark plugin).
