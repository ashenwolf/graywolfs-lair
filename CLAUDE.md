# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Astro)

# Build (clears Astro caches, then astro build)
npm run build

# Preview production build locally
npm run preview

# One-time Ghost 0.x migration
node tools/scripts/migrate-ghost.js --db path/to/ghost.db
```

The build script runs `rm -rf .astro node_modules/.astro/data-store.json` before building — this is intentional to avoid stale content cache issues.

## Architecture

### Tech Stack
- **Astro 5** with static output, deployed to **Cloudflare Pages** via `@astrojs/cloudflare` adapter
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin) — configured entirely in `src/styles/global.css` using `@theme`, `@utility`, and `@layer` directives; no `tailwind.config.*` file
- Content authored in **Markdown**, edited in **Obsidian**

### Content Collections (`src/content.config.ts`)
Two collections defined with Astro's `glob` loader:
- `articles` — loaded from `src/content/articles/`, organized by language subdirectory (`en/`, `ua/`). Frontmatter: `title`, `date`, `tags`, `lang` (en|ua), `draft`, `description`, `category` (software-engineering|travel|life), `image`. Excludes `*.excalidraw.md` files.
- `pages` — loaded from `src/content/pages/`. Frontmatter: `title` only.

### Routing / i18n
The site is bilingual (English + Ukrainian). English routes are at the root; Ukrainian routes are under `/ua/`. Each language has its own parallel set of pages under `src/pages/ua/`.

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

### Custom Remark Plugins (`src/plugins/`)
- **`remark-obsidian-embeds.js`** — Resolves Obsidian `![[filename]]` transclusions to `<img>` tags. Looks up images recursively in `public/assets/`. Excalidraw embeds (`![[name.excalidraw]]`) resolve to converted SVGs in `public/assets/excalidraw/`. Supports optional size modifier `![[name|500px]]`.
- **`remark-mermaid.js`** — Renders ` ```mermaid ` fenced code blocks to static SVGs at build time using `beautiful-mermaid`, writing them to `public/assets/mermaid/` (content-hashed filenames).

### Excalidraw Pipeline
Excalidraw conversion happens inside `remark-obsidian-embeds.js` as part of the normal Astro build. When the plugin encounters a `![[name.excalidraw]]` embed, it locates the source file (searching from the article's directory up through `src/content/`), decompresses the embedded JSON, converts it to SVG using `excalidraw-to-svg`, embeds fonts as data URIs, applies two upstream bug fixes (wrong font-family and `y="NaN"` on text elements), and writes the result to `public/assets/excalidraw/`. The standalone `tools/scripts/convert-excalidraw.js` still exists as a utility but is no longer part of the build.

### Static Assets
Images are stored in `public/assets/YYYY/MM/DD/` by post date. Mermaid SVGs go to `public/assets/mermaid/`. Excalidraw SVGs go to `public/assets/excalidraw/`. Both generated directories are gitignored.

### Layouts (`src/layouts/`)
- **`Base.astro`** — Root HTML shell with `<head>`, `Header`, `Footer`, Rubik font from Google Fonts. Props: `title: string`, `lang?: "en" | "ua"`.
- **`Article.astro`** — Article page wrapper using `Base`. Props: `title`, `date`, `tags`, `lang`, `category`, `image`. Renders hero image, article header (date, category label, tag links), article body in `prose prose-gray` div, and Disqus comments section.

### Components (`src/components/`)
- **`Header.astro`** — Nav with Home / Photography / CV links and language toggle. Props: `lang?`.
- **`Footer.astro`** — Three-column footer (nav, 2 recent posts, social links). Fetches articles at build time. Props: `lang?`.
- **`ArticleCard.astro`** — Article card with thumbnail, date, title, tags. Props: `href`, `title`, `date`, `description?`, `tags?`, `image?`, `lang?`, `tagBase?`.
- **`ArticleCardFeatured.astro`** — Featured card with gradient by category (blue/teal/purple), 16:9 aspect ratio. Props: `href`, `title`, `date`, `category?`, `image?`, `lang?`.
- **`ArticleList.astro`** — Renders a list of articles using `ArticleCard`. Props: `articles`, `emptyMessage?`, `lang?`.
- **`SectionBlock.astro`** — Homepage section with info column (1/3) and 2×2 featured grid (2/3). Props: `title`, `description`, `moreHref`, `moreLinkLabel?`, `articles`, `lang?`.
- **`SocialLinks.astro`** — Hardcoded social icons (GitHub, LinkedIn, X, Instagram, Flickr, 500px) with inline SVGs.

### Utilities (`src/utils/`)
- **`articleUrls.ts`** — `getArticleUrl(article)` generates `/YYYY/MM/DD/slug` from frontmatter date and filename. `getArticlesWithUrls(articles)` maps a collection to objects with the `url` property.
- **`collections.ts`** — `getArticlesByLang(lang)` filters articles by language. `makeTagPaths(lang, opts)` and `makeCategoryPaths(lang, opts)` are `getStaticPaths` factories shared by the en/ua page pairs.
- **`date.ts`** — `formatDate(date, lang, "short"|"long")` and `formatDateShort(date, lang)` for locale-aware date formatting.
- **`tags.ts`** — `countTags(articles)` and `getSortedTags(counts)` for tag frequency maps.

### Constants (`src/constants/`)
- **`labels.ts`** — Single source of truth for all translatable strings and category metadata:
  - `CATEGORY_LABELS` — category names in both languages
  - `CATEGORY_GRADIENTS` — Tailwind gradient classes per category
  - `UI` — UI strings for both languages (nav labels, section headings, empty states)
  - `buildNav(lang)` — returns `{ navLinks, langToggle }` used by both Header and Footer

### Tools (`tools/scripts/`)
- **`migrate-ghost.js`** — One-time Ghost 0.x → Astro migration. CLI: `--db`, `--ghost-url`, `--dry-run`, `--lang`, `--add-tags`, `--category`. Uses `better-sqlite3` and `turndown`.
- **`add-categories.js`** — Backfills `category` frontmatter on existing articles based on tags. CLI: `--dry-run`, `--force`.
- **`convert-excalidraw.js`** — Standalone Excalidraw → SVG converter (same logic as the remark plugin).

### Routing / URL Structure
Articles use a clean date-based URL structure: `/YYYY/MM/DD/slug`. The physical Markdown files remain organized by language in `src/content/articles/en/` and `src/content/articles/ua/`, but the public URLs follow the date-based pattern without any language prefix. URL generation is in `src/utils/articleUrls.ts`; routing is handled by `src/pages/[...slug].astro`.

---

## Design Constraints

### i18n — one truth, two surfaces
- All translatable strings live in `src/constants/labels.ts` (`UI`, `CATEGORY_LABELS`). Never hardcode user-visible text directly in a component or page.
- The `lang` prop flows top-down from page → layout → component. Components default to `"en"` when `lang` is omitted.
- Navigation structure is defined once in `buildNav(lang)`. Do not reconstruct nav links inline in any component.

### Category metadata
- Valid categories are the `CATEGORIES` tuple in `labels.ts`: `software-engineering`, `travel`, `life`. Do not add a new category without adding it there first (labels for both languages + gradient).
- Always look up category display names via `CATEGORY_LABELS[category][lang]`. Never hardcode a category label string in a component or page.

### Bilingual page pairs
- Every page under `src/pages/` has a mirror under `src/pages/ua/`. Keep them in sync structurally — they should differ only in the `lang` argument and genuinely language-specific content (hero copy, etc.).
- Shared `getStaticPaths` logic belongs in `src/utils/collections.ts` as a factory. Page files delegate to the factory in one line; they do not contain collection-querying logic themselves.
- Avoid adding language-specific logic to shared components — pass `lang` as a prop and look up strings from `labels.ts`.

### Date formatting
- All dates rendered to the user must go through `formatDate` or `formatDateShort` from `src/utils/date.ts`. Do not call `toLocaleDateString` inline.

### Styling
- Tailwind CSS v4 only. All theme tokens (`--color-*`, `--font-*`, custom utilities) are defined in `src/styles/global.css`. Do not create a `tailwind.config.*` file.
- Use existing design tokens (`text-accent`, `bg-surface`, `bg-hero-bg`, `photo-glow`, `container-inner`, etc.) rather than arbitrary hex values or one-off classes.
- Category gradients are defined in `CATEGORY_GRADIENTS` in `labels.ts` — do not hardcode gradient classes in components.

### Astro component conventions
- Import order in frontmatter: external/Astro imports → internal components/layouts → utils → constants → types.
- `lang` props are always typed as `"en" | "ua"` (the `Lang` type from `labels.ts`), never as plain `string`.
- Use `Lang` from `labels.ts` for all language type annotations — do not redeclare it locally.
- Do not create barrel `index.ts` files unless there is a clear need.

### What belongs where
| Concern | Location |
|---------|----------|
| Translatable UI strings | `src/constants/labels.ts` |
| Category metadata (names, gradients) | `src/constants/labels.ts` |
| Nav structure | `buildNav()` in `src/constants/labels.ts` |
| Date formatting | `src/utils/date.ts` |
| Tag counting / sorting | `src/utils/tags.ts` |
| Collection filtering + `getStaticPaths` factories | `src/utils/collections.ts` |
| Article URL generation | `src/utils/articleUrls.ts` |
| Page markup | `src/pages/` (keep thin — data prep only, delegate logic to utils) |
| Reusable UI | `src/components/` |
