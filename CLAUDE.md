# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Self-update rule:** After every change to the codebase that affects architecture, routing, utilities, components, or conventions documented here, update this file (and AGENTS.md, which is a symlink to it) to reflect the new state. Keep README.md in sync as well.

## Domains

- **https://gulenok.lu** — English (primary/canonical, set as `site` in `astro.config.mjs`)
- **https://graywolf.org.ua** — Ukrainian

Each language's origin lives in `LOCALES` (`src/constants/site.ts`). `Base.astro` builds canonical and OG URLs on the page language's own domain. In production the header's language toggle switches domain (not just the `/ua/` prefix): `crossDomainHref()` in `src/utils/urls.ts` computes the target at build time into `data-prod-href`, and an inline script in `Header.astro` applies it only on the two live hostnames, so dev and `pages.dev` previews keep the relative link. Articles have no translation, so an article's toggle goes to the other language's home page. The footer toggle stays relative.

## Commands

```bash
# Development
npm run dev          # Start dev server (Astro)

# Build (clears Astro caches, then astro build)
npm run build

# Preview production build locally
npm run preview
```

The build script runs `rm -rf .astro node_modules/.astro/data-store.json` before building — this is intentional to avoid stale content cache issues.

## Architecture

### Tech Stack
- **Astro 5** with static output, deployed to **Cloudflare Pages** via `@astrojs/cloudflare` adapter
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin) — configured entirely in `src/styles/global.css` using `@theme`, `@utility`, and `@layer` directives; no `tailwind.config.*` file
- Content authored in **Markdown**, edited in **Obsidian**

### Content Collections (`src/content.config.ts`)
One collection, `articles`, defined with Astro's `glob` loader from `src/content/articles/`, organized by language subdirectory (`en/`, `ua/`). Frontmatter: `title`, `date`, `tags`, `lang`, `draft`, `description`, `category`, `image`. The `lang` and `category` enums come from `LANGS` and `CATEGORY_IDS` in `src/constants/site.ts`. Excludes `*.excalidraw.md` files.

### Routing / i18n
The site is bilingual (English + Ukrainian). English routes are at the root; Ukrainian routes are under `/ua/`. Each route file pair renders one shared view from `src/views/` and differs only in `lang` (plus a page title where the copy is page-specific). The CV exists in English only; `/ua/cv` is a placeholder.

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
| `/rss.xml` | `src/pages/rss.xml.ts` (English posts) |
| any missing path | `src/pages/404.astro` → `dist/404.html`, served by Cloudflare Pages with status 404 on both domains, so it shows both languages. No canonical URL, `noindex`; its language toggle goes to the other home page. |

Category pages exist only for categories that have posts in that language (EN travel has none); the home page section for such a category shows no "See more" link.

### Custom Remark Plugins (`src/plugins/`)
- **`remark-mermaid.js`** — Renders ` ```mermaid ` fenced code blocks to static SVGs at build time using `beautiful-mermaid`, writing them to `public/assets/mermaid/` (content-hashed filenames).
- **`remark-obsidian-embeds.js`** — Resolves Obsidian `![[filename]]` transclusions to `<img>` tags. Looks up images recursively in `public/assets/`. Excalidraw embeds (`![[name.excalidraw]]`) resolve to converted SVGs in `public/assets/excalidraw/`. Supports optional size modifier `![[name|500px]]`.
- **`remark-obsidian-links.js`** — Converts Obsidian `[[wikilinks]]` (and `[[filename|display text]]`) to proper site URLs using the date-based slug structure (`/YYYY/MM/DD/slug`). Looks up the target article's frontmatter date to build the URL.
- **`remark-image-captions.js`** — Detects an italic paragraph immediately following an image paragraph and wraps both in a `<figure>` with the italic text as `<figcaption>`.

### Image Optimization (`src/plugins/integration-optimize-images.js`)
An Astro integration that runs as a post-build hook (`astro:build:done`). It:
- Walks all generated HTML in `dist/`
- Finds `<img>` tags pointing to local PNG/JPG files in `public/assets/`
- Converts them to WebP (max 1200px width, quality 80) via `sharp`
- Adds `loading="lazy"`, `decoding="async"`, and computed `width`/`height` attributes
- Writes optimized files to `public/assets/optimized/` (gitignored)
- Rewrites `src` attributes in the HTML to point to the optimized versions
- Deletes every PNG/JPG left under `dist/assets/images/`, so a raster referenced any other way (e.g. `<link rel="icon">`) must live outside `public/assets/images/`. The favicon is `public/favicon.png` for this reason. A deleted asset then returns the 404 page (`src/pages/404.astro`) with status 404; before Nov 2026 there was no `404.html` and Cloudflare Pages served missing paths as `200 text/html`, so a deleted asset looked like a success.

### Excalidraw Pipeline
Excalidraw conversion happens inside `remark-obsidian-embeds.js` as part of the normal Astro build. When the plugin encounters a `![[name.excalidraw]]` embed, it locates the source file (searching from the article's directory up through `src/content/`), decompresses the embedded JSON, converts it to SVG using `excalidraw-to-svg`, embeds fonts as data URIs, applies two upstream bug fixes (wrong font-family and `y="NaN"` on text elements), and writes the result to `public/assets/excalidraw/`. The standalone `tools/scripts/convert-excalidraw.js` still exists as a utility but is no longer part of the build.

### Static Assets
Images are stored in `public/assets/YYYY/MM/DD/` by post date. Mermaid SVGs go to `public/assets/mermaid/`. Excalidraw SVGs go to `public/assets/excalidraw/`. Both generated directories are gitignored.

### Data pipeline
Content flows one way: content collection → `toPost()` → `Post` → views → components. Everything a component renders is precomputed on `Post`.

- **`src/constants/site.ts`** — the tables. `LOCALES` holds one complete spec per language (origin, path prefix, `<html lang>`, date locale, home page copy, UI strings). `CATEGORIES` holds one per category (gradient, fallback cover, label and blurb per language); `CATEGORY_IDS` order is the home page section order. `SITE` holds the author name and photo.
- **`src/utils/posts.ts`** — the producer. `Post` = `{ url, lang, title, date, description, cover, tags: {name, href}[], category: {id, label, gradient} }`. `loadPosts(lang)` returns published posts, newest first (URL breaks same-date ties, so pagination is stable across builds). `loadArticles()` returns every routable entry with its `Post` (drafts too under `astro dev`). `tagPaths`/`categoryPaths` are the `getStaticPaths` bodies for listings; each page gets a localized `heading` prop. `tagCounts` and `homeSections` feed the tag index and the home page.
- **`src/utils/urls.ts`** — every URL rule: `localPath(lang, path)`, `absoluteUrl(lang, path)`, `articlePath(id, date)` (`/YYYY/MM/DD/slug`), `nav(lang)` (header and footer links plus toggle), `crossDomainHref`, `PROD_HOSTS`.
- **`src/utils/date.ts`** — `formatDate(date, lang, "short" | "long" | "month")`.
- **`src/utils/analytics.ts`** — the PostHog event table and the `onClick`/`onView` attribute helpers (see below).

### Views (`src/views/`) — one body per EN/UA route pair
- **`Home.astro`** — hero (copy from `LOCALES[lang].home`), latest 6 posts, one `SectionBlock` per category. Props: `lang`.
- **`Listing.astro`** — paginated list of `ArticleCard`s for tag and category pages. Props: `lang`, `heading`, `page: Page<Post>`.
- **`Tags.astro`** — tag index with counts. Props: `lang`.
- **`ComingSoon.astro`** — placeholder for photography and the UA CV. Props: `lang`, `title`, `heading?`.

### Layouts (`src/layouts/`)
- **`Base.astro`** — HTML shell: self-hosted Noto Serif `@font-face` + preloads, favicon, canonical/OG/Twitter meta on the page language's domain, PostHog, `Header`, `Footer`. Props: `title`, `lang`, `description?`, `image?` (defaults to `SITE.authorPhoto`).
- **`Article.astro`** — article header (category label, title, date, tag links) and `prose` body. Props: `post: Post`. An inline script placed before the body (so it is listening before any body image fails) retries a failed body image once after 2 s, then replaces it with a placeholder: a 75–240 px grey square for Flickr thumbnails (size from the URL suffix), otherwise a 16:9 grey box with "Image unavailable", the alt text and, for Flickr, a link to the photo. Strings come from `LOCALES[lang].ui`. Most old UA images are Flickr hotlinks, which Flickr throttles.

### Components (`src/components/`)
All take `lang` as a required prop where they render text.
- **`Header.astro`** — logo, `nav(lang)` links, language toggle (desktop + mobile), mobile menu.
- **`Footer.astro`** — nav (with relative toggle), 2 most recent posts, social links.
- **`ArticleCard.astro`** — list row: cover, date, title, tag names. Props: `post`, `lang`.
- **`ArticleCardFeatured.astro`** — 16:9 card with cover or category gradient. Props: `post`, `lang`.
- **`SectionBlock.astro`** — home page category section: blurb column and 2×2 grid. Props: `title`, `blurb`, `href`, `posts`, `lang`.
- **`Pagination.astro`** — Previous / Page X of Y / Next, rendered only when there is more than one page. Props: `page`, `lang`.
- **`SocialLinks.astro`** — social icons with inline SVGs.
- **`posthog.astro`** — PostHog snippet plus the single delegated event listener.

### Tools (`tools/scripts/`)
- **`convert-excalidraw.js`** — Standalone Excalidraw → SVG converter (same logic as the remark plugin).

### Routing / URL Structure
Articles use a clean date-based URL structure: `/YYYY/MM/DD/slug`. The physical Markdown files remain organized by language in `src/content/articles/en/` and `src/content/articles/ua/`, but the public URLs follow the date-based pattern without any language prefix. URL generation is `articlePath()` in `src/utils/urls.ts`; routing is handled by `src/pages/[...slug].astro`.

### PostHog Analytics (`src/components/posthog.astro`)
Client-side analytics via PostHog JS snippet, loaded in `Base.astro` `<head>`.

**Configuration:**
- Env vars: `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST` (defined in `.env`, set in Cloudflare Pages env)
- EU instance: `https://eu.i.posthog.com`
- Project ID: 173488
- Dashboard: https://eu.posthog.com/project/173488/dashboard/664021

**Custom events** (typed in `src/utils/analytics.ts`; one delegated listener in `posthog.astro` sends them):

| Event | Properties | Declared in |
|-------|-----------|------|
| `article_read` | `title`, `category`, `tags`, `lang` | `Article.astro` (`onView`) |
| `tag_clicked` | `tag`, `article_title` | `Article.astro` |
| `cv_viewed` | — | `cv.astro` (`onView`) |
| `social_link_clicked` | `platform`, `page?` | `SocialLinks.astro`, `cv.astro` (header links, `page: "cv"`) |
| `language_switched` | `to_lang` | `Header.astro` |
| `article_card_clicked` | `title`, `category`, `href` | `ArticleCardFeatured.astro` |
| `category_more_clicked` | `section`, `href` | `SectionBlock.astro` |

**Adding an event:**
- Add it with its properties to `Events` in `src/utils/analytics.ts`.
- Spread `onClick("event", props)` onto the clicked element, or `onView("event", props)` onto an element of the page that should report a view. No per-component `<script>`.
- Keep event names snake_case; include context (what was clicked, which page, which language).
- Don't track PII — no emails, names, or IP-derived data.

---

## Design Constraints

### i18n — one table, two surfaces
- Everything that differs between the languages is a field of `LOCALES[lang]` in `src/constants/site.ts`. Components read `LOCALES[lang]`; they never branch on `lang === "ua"`. A new language-dependent value is a new field in both entries: a field missing from one is a type error wherever it is read through `LOCALES[lang]` (and, for `home`, at the `satisfies` clause).
- Never hardcode user-visible text in a component or view. Page-specific titles (e.g. `title="Фото"`) are passed by the route file.
- `lang` flows top-down from route → view → layout → component and is a required prop everywhere (no `"en"` default), so a forgotten `lang` fails `astro check`.
- Navigation is defined once in `nav(lang)` (`src/utils/urls.ts`); build site paths with `localPath(lang, path)`.

### Category metadata
- Categories are the keys of `CATEGORIES` in `site.ts` (`CATEGORY_IDS`: `software-engineering`, `travel`, `life`). A new category is one new entry there (gradient, fallback cover, label and blurb for both languages); the content schema, home sections and category pages pick it up.
- Components read `post.category.label` / `.gradient`; they never look categories up themselves.

### Bilingual page pairs
- Every route under `src/pages/` has a mirror under `src/pages/ua/` (except the English-only CV). A pair renders the same view from `src/views/` and differs only in `lang` and route-specific titles.
- `getStaticPaths` for listings is one line delegating to `tagPaths`/`categoryPaths` in `src/utils/posts.ts`.

### Date formatting
- All dates rendered to the user go through `formatDate` from `src/utils/date.ts`. Do not call `toLocaleDateString` inline.

### Styling
- Tailwind CSS v4 only. All theme tokens (`--color-*`, `--font-*`, custom utilities) are defined in `src/styles/global.css`. Do not create a `tailwind.config.*` file.
- Use existing design tokens (`text-accent`, `bg-surface`, `bg-hero-bg`, `photo-glow`, `container-inner`, etc.) rather than arbitrary hex values or one-off classes.
- Category gradients are defined in `CATEGORIES` in `site.ts` — do not hardcode gradient classes in components.
- Prefer Tailwind classes over hand-written CSS. Global element styles (`scroll-smooth` on `<html>`, `font-sans` on `<body>`) belong as classes on the element in `Base.astro`, not in `@layer base` in `global.css`. Prose typography overrides belong as `prose-*` modifier classes on the prose container (they live in `@layer utilities` and beat the plugin's `@layer components` styles). Only add CSS to `global.css` when no Tailwind class can express the rule (e.g. attribute selectors like `[src*="..."]`, or complex `@keyframes`).

### Astro component conventions
- Import order in frontmatter: external/Astro imports → internal components/layouts → utils → constants → types.
- Type languages and categories with `Lang` and `Category` from `site.ts`, never as plain `string`, and do not redeclare them.
- Do not create barrel `index.ts` files unless there is a clear need.

### Data flow — concentrate complexity in producers

Every page, component, and route is the end of a pipeline. Push transformation work upstream into producers; keep consumers stupid. Consumers read pre-computed fields — they do not sort, filter, enrich, or re-derive.

- **One producer per shape.** If multiple consumers need the same filtered/sorted/enriched data, that work lives in one function, not N. Adding a sixth `await getCollection(...).filter(...).sort(...)` to a page is a smell — the producer should already return that shape.
- **Producers output the consumer-ready shape.** `loadPosts(lang)` in `src/utils/posts.ts` is the single producer for "published articles in this language." It filters drafts, sorts, and builds each `Post` (URL, cover fallback, localized category, tag links) in one pass. Every view, the Footer, the RSS feed, and the listing path producers consume its output directly.
- **Type the enriched shape explicitly.** `Post` is the contract that flows through the system. Components declare `post: Post` (or `Post[]`); they never accept a raw `CollectionEntry<"articles">` and re-derive fields.
- **Working backwards beats working forwards.** When adding a feature, first write down the shape the consumer wants. Then push the work to produce it as far upstream as it'll go. The consumer should look like rendering, not data prep.

### Escape hatches

Don't force the abstraction when consumers genuinely need different shapes:
- `loadArticles()` is the second producer, for `src/pages/[...slug].astro`: it needs both languages, the raw entry for `render()`, and drafts under `astro dev` (`import.meta.env.DEV`) so they can be previewed by direct URL locally; production builds skip them. These two are the only paths into the article collection. If you add another, leave a comment explaining why.
- **Don't pre-emptively factor.** If only one consumer needs a transformation, leave it inline. The point of consolidating is to kill *repeated* work, not to anticipate hypothetical reuse.
- **Flags are a smell.** If a producer would need parameters like `loadPosts(lang, { includeDrafts: true })` to serve two consumers, the consumers want different shapes. Split the producer instead of branching it internally.

### Remark plugins follow the same rule

Remark plugins are pipeline stages by construction — unified composes them in order, each reads the MDAST tree and emits a transformed tree the next stage consumes. Apply the producer/consumer rule when writing one:
- **Emit standard AST shapes** (`image`, `link`, `paragraph`, `html`) that downstream stages and rehype can render without plugin-specific knowledge. `remark-obsidian-embeds.js` translates `![[name]]` into plain `image` nodes; `remark-mermaid.js` translates ` ```mermaid ` code blocks into `image` nodes pointing at generated SVGs. Downstream rendering is unaware either plugin ran.
- **Never emit a custom node shape that requires a paired downstream plugin to interpret.** If reading your plugin's output requires a second plugin you also wrote, you split one producer across two stages.
- **Side-effect output is fine when deterministic and content-addressable.** Both plugins write generated SVGs to `public/assets/...`. `remark-mermaid.js` content-hashes the filename so reruns are idempotent. If a plugin writes files, hash on the inputs that affect the output (source content + theme/config) so cache busting is automatic.
- **Don't read state the prior stage didn't put in the tree.** A plugin that needs to know "did the obsidian plugin already run?" is a sign of leaky pipeline boundaries — fix the producer to put what's needed into the AST.

### What belongs where
| Concern | Location |
|---------|----------|
| Per-language strings, origins, locales | `LOCALES` in `src/constants/site.ts` |
| Category metadata (labels, blurbs, gradients, fallback cover) | `CATEGORIES` in `src/constants/site.ts` |
| Article shape, loading, listings, tag counts | `src/utils/posts.ts` |
| URLs and nav | `src/utils/urls.ts` |
| Date formatting | `src/utils/date.ts` |
| Analytics events | `src/utils/analytics.ts` |
| Page bodies shared by EN/UA | `src/views/` |
| Route files | `src/pages/` (one line of `getStaticPaths` at most, then a view) |
| Reusable UI | `src/components/` |
