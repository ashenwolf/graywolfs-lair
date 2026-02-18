# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Astro)

# Build (includes Excalidraw conversion + Astro build; also clears caches)
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
The site is bilingual (English + Ukrainian). English routes are at the root (`/`, `/articles/...`, `/tags/...`); Ukrainian routes are under `/ua/` (`/ua/`, `/ua/tags/...`). Each language has its own parallel set of pages under `src/pages/ua/`.

### Custom Remark Plugins (`src/plugins/`)
- **`remark-obsidian-embeds.js`** — Resolves Obsidian `![[filename]]` transclusions to `<img>` tags. Looks up images recursively in `public/assets/`. Excalidraw embeds (`![[name.excalidraw]]`) resolve to converted SVGs in `public/assets/excalidraw/`. Supports optional size modifier `![[name|500px]]`.
- **`remark-mermaid.js`** — Renders ` ```mermaid ` fenced code blocks to static SVGs at build time using `beautiful-mermaid`, writing them to `public/assets/mermaid/` (content-hashed filenames).

### Excalidraw Pipeline
Excalidraw conversion happens inside `remark-obsidian-embeds.js` as part of the normal Astro build. When the plugin encounters a `![[name.excalidraw]]` embed, it locates the source file (searching from the article's directory up through `src/content/`), converts it to SVG using `excalidraw-to-svg`, embeds fonts as data URIs, applies two upstream bug fixes (wrong font-family and `y="NaN"` on text elements), and writes the result to `public/assets/excalidraw/`. The standalone `tools/scripts/convert-excalidraw.js` still exists as a utility but is no longer part of the build.

### Static Assets
Images are stored in `public/assets/YYYY/MM/DD/` by post date. Mermaid SVGs go to `public/assets/mermaid/`. Excalidraw SVGs go to `public/assets/excalidraw/`.

### Layouts
- `Base.astro` — Root HTML shell with `<head>`, `Header`, `Footer`, Rubik font from Google Fonts. Accepts `title` and `lang` props.
- `Article.astro` — Article page wrapper using `Base`. Renders header with date, tags (linked to tag pages), optional category label and hero image. Article body is in a `prose prose-gray` div.

### Routing / URL Structure
Articles use a clean date-based URL structure: `/YYYY/MM/DD/slug`. The physical Markdown files remain organized by language in `src/content/articles/en/` and `src/content/articles/ua/`, but the public URLs follow the date-based pattern without any prefix. The URL generation happens in `src/pages/[...slug].astro` using the article's frontmatter date and filename.
