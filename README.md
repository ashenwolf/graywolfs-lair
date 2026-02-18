# Gulenok's blog

This is a package for my new blog. It will contain:
- Articles and pages
- Blog UI
- Scripts for automation and migration of the data (I have a previous blog on Ghost that I need to import)

## Planned features

- Powered by Astro
- Deployed via Cloudflare Pages using the `@astrojs/cloudflare` adapter
- Clean Tailwind-based UI
- Blog posts written in Markdown, edited in Obsidian
- Mermaid diagrams rendered client-side via `mermaid` loaded from CDN — compatible with Obsidian's ` ```mermaid ` fenced blocks, no build-time browser dependency
- Excalidraw images converted to SVG at build time via a script in `tools/scripts/` using `excalidraw-to-svg`, output to `public/assets/excalidraw/`
- Obsidian transclusions (`![[file.excalidraw]]`, `![[image.png]]`) resolved to `<img>` tags via a custom remark plugin

### Build pipeline (Cloudflare Pages)

```bash
node tools/scripts/convert-excalidraw.js && astro build
```

This runs on every deploy to `main`, so Excalidraw conversion happens automatically.

## Planned folder structure

```
src/
  content/
    articles/
      ua/              # ukrainian
      en/              # english
    pages/             # static pages (about, etc.)
  pages/               # Astro route pages (.astro files)
  layouts/             # layout components
  components/          # UI components
  styles/              # Tailwind styles
public/
  assets/              # static assets by date of post
    YYYY/
      MM/
        DD/
tools/                 # various tools, not deployed
  scripts/
```

## Ghost 0.x migration

The previous blog runs on Ghost 0.x with a SQLite database. A one-time migration script at `tools/scripts/migrate-ghost.js` will:

1. Read the Ghost SQLite file using `better-sqlite3`
2. Extract posts from the `posts` table — title, slug, markdown body, `published_at`, status, and language
3. Convert Ghost's markdown/HTML content to clean markdown compatible with Astro content collections
4. Download referenced images and save them to `public/assets/YYYY/MM/DD/`
5. Generate frontmatter (title, slug, date, tags, language, draft status) and write each post to `src/content/articles/{lang}/`

```bash
# run the migration (one-time)
node tools/scripts/migrate-ghost.js --db path/to/ghost.db
```

The SQLite file should not be committed to the repo — add it to `.gitignore`.

## Getting started

```bash
# scaffold the Astro project
npm create astro@latest

# install dependencies
npm install

# start the dev server
npm run dev

# build for production
npm run build
```
