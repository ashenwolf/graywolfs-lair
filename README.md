# Gulenok's blog

A bilingual (English + Ukrainian) static blog built with Astro 5, deployed to Cloudflare Pages.

**Domains:**
- **https://gulenok.lu** — English (primary/canonical)
- **https://graywolf.org.ua** — Ukrainian

The language toggle in production switches between domains (not just `/ua/` prefix).

## Stack

- **Astro 5** — static site generation
- **Tailwind CSS v4** — configured in `src/styles/global.css` via `@theme`/`@utility`/`@layer`; no `tailwind.config.*` file
- **Cloudflare Pages** via `@astrojs/cloudflare` adapter
- **PostHog** — client-side analytics (EU instance)
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
  pages/               # Astro route files: thin, each renders a view
    ua/                # Ukrainian routes (/ua/*)
  views/               # Page bodies shared by the EN/UA route pairs
  layouts/             # Base.astro, Article.astro
  components/          # UI components
  plugins/             # Custom remark plugins + Astro integration
  styles/              # global.css (Tailwind theme)
  utils/               # posts.ts (Post producer), urls.ts, date.ts, analytics.ts
  constants/           # site.ts (LOCALES, CATEGORIES, SITE tables)
public/
  assets/              # Static images (YYYY/MM/DD/)
    excalidraw/        # Generated at build time (gitignored)
    mermaid/           # Generated at build time (gitignored)
    optimized/         # Optimized WebP images (generated at build time, gitignored)
  fonts/               # Self-hosted Noto Serif WOFF2 subsets (latin + cyrillic)
tools/
  scripts/             # Utility and migration scripts (not deployed)
```

## Routing

The site is bilingual. English routes are at the root; Ukrainian routes are under `/ua/`:

| Route | File |
|-------|------|
| `/` | `src/pages/index.astro` |
| `/tag` | `src/pages/tag/index.astro` |
| `/tag/[tag]` | `src/pages/tag/[tag]/[...page].astro` |
| `/category/[category]` | `src/pages/category/[category]/[...page].astro` |
| `/cv` | `src/pages/cv.astro` |
| `/photography` | `src/pages/photography/index.astro` |
| `/YYYY/MM/DD/slug` | `src/pages/[...slug].astro` |
| `/ua/*` | mirrors the above under `src/pages/ua/` |
| any missing path | `src/pages/404.astro` (status 404, both languages) |

Article URLs are date-based (`/YYYY/MM/DD/slug`), generated from frontmatter `date` and filename by `articlePath()` in `src/utils/urls.ts`.

Everything that differs between the languages (domain, path prefix, date locale, UI strings, home page copy) is one entry of `LOCALES` in `src/constants/site.ts`; categories are entries of `CATEGORIES` there.

## Content collection

Defined in `src/content.config.ts`:

**`articles`** — `src/content/articles/**/*.md` (excludes `*.excalidraw.md`)
- `title` (required), `date` (required), `tags` (default `[]`), `lang` (`en`|`ua`, default `en`), `draft` (default `false`), `description`, `category` (`software-engineering`|`travel`|`life`), `image`

Pages read articles only through `src/utils/posts.ts`, which turns each entry into a `Post` (URL, cover, localized category, tag links).

## Custom remark plugins

- **`remark-mermaid.js`** — renders ` ```mermaid ` blocks to static SVGs using `beautiful-mermaid`, output to `public/assets/mermaid/` with content-hashed filenames.
- **`remark-obsidian-embeds.js`** — resolves Obsidian `![[filename]]` transclusions: images → `<img>` tags, `![[name.excalidraw]]` → SVG conversion, `![[name|500px]]` → image with width.
- **`remark-obsidian-links.js`** — converts Obsidian `[[wikilinks]]` to proper site URLs using date-based slug structure.
- **`remark-image-captions.js`** — converts italic text immediately following an image into a `<figcaption>` wrapped in `<figure>`.

## Image optimization

The `integration-optimize-images.js` Astro integration runs after build and post-processes all generated HTML:
- Finds `<img>` tags pointing to local PNG/JPG files in `public/assets/`
- Converts them to WebP (max 1200px width, quality 80) using sharp
- Adds `loading="lazy"`, `decoding="async"`, and `width`/`height` attributes
- Outputs optimized files to `public/assets/optimized/` (gitignored)
- Deletes the original PNG/JPG files from `dist/assets/images/`; rasters referenced outside `<img>` (like the favicon at `public/favicon.png`) must live elsewhere

## Excalidraw pipeline

When `remark-obsidian-embeds.js` encounters a `![[name.excalidraw]]` embed it:
1. Locates the `.excalidraw.md` source file (searches from article's directory upward through `src/content/`)
2. Decompresses the embedded Excalidraw JSON
3. Converts to SVG via `excalidraw-to-svg`, embeds fonts as base64 data URIs
4. Applies upstream bug fixes (wrong font-family, `y="NaN"` on text elements)
5. Writes the result to `public/assets/excalidraw/`

## Analytics (PostHog)

Client-side tracking via `src/components/posthog.astro`, included in `Base.astro` `<head>`.
- Events and their properties are typed in `src/utils/analytics.ts`; elements declare them with `onClick`/`onView`, and one delegated listener sends them
- EU instance (`https://eu.i.posthog.com`), configured via env vars `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`

## Tools

- **`tools/scripts/convert-excalidraw.js`** — standalone Excalidraw → SVG converter
