# gulenok.lu deployment and production checks

How the site reaches production, how to check a deploy, and what past live audits found. Architecture and code conventions live in [CLAUDE.md](../CLAUDE.md); this file holds only what you need to verify or debug the live site.

| What | Where |
|------|-------|
| Repository | `github.com/ashenwolf/graywolfs-lair` |
| Hosting | Cloudflare Pages project `graywolfs-lair`, git-connected to the repository |
| Domains | `gulenok.lu` (English) and `graywolf.org.ua` (Ukrainian), both serving the same build |
| Sitemap | `src/pages/sitemap.xml.ts` builds `/sitemap.xml`; `public/robots.txt` names `https://gulenok.lu/sitemap.xml` |
| Missing paths | `src/pages/404.astro`, served with status 404 |
| Favicon | `public/favicon.png` |
| Analytics | PostHog EU (`https://eu.i.posthog.com`), `src/components/posthog.astro` |

## How it deploys

Every push to `main` builds and deploys on Cloudflare Pages. There is no local deploy path: `wrangler` on a developer machine has no token.

Read deploy state from the commit's GitHub check runs:

```sh
curl -sS "https://api.github.com/repos/ashenwolf/graywolfs-lair/commits/<sha>/check-runs"
```

`Cloudflare Pages` is the deploy. `Workers Builds: graywolfs-lair` comes from another Cloudflare account and does not gate Pages: it failed on `5f948f9` and still fails at `cc3c9b2` (2026-11-26) while Pages deploys fine.

## Checks after a push

Run each on both hosts. For an asset, read the body as well as the status: a missing file returns the 404 page, which is HTML.

| # | Check | Command | Expected |
|---|-------|---------|----------|
| 1 | Pages deployed | check runs above | `Cloudflare Pages` `completed` `success` |
| 2 | Favicon is a PNG | `curl -sS -o /tmp/f.png -w '%{http_code} %{content_type}\n' https://gulenok.lu/favicon.png && file /tmp/f.png` | `200 image/png`, `PNG image data` |
| 3 | Missing path is a 404 | `curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://gulenok.lu/no-such-page/` | `404 text/html` |
| 4 | Drafts are not published | `curl -sS -o /dev/null -w '%{http_code}\n' https://gulenok.lu/2010/01/01/hello-world/` (`hello-world.md` is `draft: true`) | `404` |
| 5 | Sitemap serves and parses | `curl -sS -o /tmp/sm.xml -w '%{http_code} %{content_type}\n' https://gulenok.lu/sitemap.xml && xmllint --noout /tmp/sm.xml` | `200 application/xml`, no xmllint output |
| 6 | Canonical follows the page language, not the host | `curl -sSL https://graywolf.org.ua/2026/05/12/digging-faster-in-the-wrong-place/ \| grep -oE '<(html\|link rel="canonical"\|meta property="og:url")[^>]*>'` | `lang="en"`, canonical and `og:url` on `https://gulenok.lu/` |
| 7 | PostHog loader reachable | `curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://eu.i.posthog.com/static/array.js` | `200 text/javascript` |

All seven returned the expected reading on 2026-11-26 at `cc3c9b2`.

The favicon check guards a regression fixed in `9f092da` (2026-11-02): the image integration deleted the favicon from the build while the HTML still linked it. CLAUDE.md › Image Optimization explains why it now lives in `public/favicon.png`.

## Local checks before a push

`npm run build` proves the artifacts generate. It does not prove Pages routing or sitemap correctness.

**Sitemap.** Every `<loc>` must be unique and equal its built page's canonical URL:

```sh
xmllint --noout dist/sitemap.xml
locs=$(grep -o '<loc>[^<]*' dist/sitemap.xml | sed 's/<loc>//')
echo "$locs" | wc -l; echo "$locs" | sort -u | wc -l
for u in $locs; do f="dist/${u#https://*/}index.html"
  grep -q "<link rel=\"canonical\" href=\"$u\"" "$f" 2>/dev/null || echo "MISMATCH $u"; done
```

The count is article pages plus 3 (both home pages and `/cv/`), so it changes with content. At `884f837` (2026-11-03) and again at `cc3c9b2` (2026-11-26): 419 locations = 416 articles + 3, 409 on `graywolf.org.ua`, 10 on `gulenok.lu`, 0 mismatches. Tag and category listings are left out on purpose; internal links lead to them.

**Pages routing.** Run the real Pages router on a copy of `dist`, from outside the repository. The repository's gitignored `.wrangler/deploy/config.json` points at a `dist/server/wrangler.json` that the static build does not produce, and `wrangler` reads that file from its working directory, so it refuses to start inside the repository even on a copied `dist`.

```sh
repo=$PWD; rm -rf /tmp/gl-dist && cp -R dist /tmp/gl-dist
cd /tmp && "$repo/node_modules/.bin/wrangler" pages dev /tmp/gl-dist --port 8799
```

Expected on 2026-11-26: `/` is `200 text/html`, `/no-such-page/` is `404 text/html`, `/sitemap.xml` is `200 application/xml`, `/favicon.png` is `200 image/png`.

**Dead internal links.** Resolve every `href="/…"` and `src="/…"` in the built HTML against `dist/` as a file, a directory `index.html`, or a `.html` file.

**Proving a change leaves the HTML alone.** Build `HEAD` from `git archive` and build the change, then diff the two `dist/` trees. Normalise `/assets/optimized/*-<8hex>.webp` names first: the hash covers the absolute source path, so two checkouts never match. `public/assets/excalidraw/` is gitignored, so an archived tree has no cached Excalidraw SVGs; the only Excalidraw embed today is in the draft `hello-world.md`, which production does not build.

## Known differences between live HTML and `dist/`

- `/cv/` always differs. Cloudflare Email Obfuscation rewrites the `mailto:` link to `/cdn-cgi/l/email-protection#…` plus a `__cf_email__` span and keeps the other attributes (`data-ph-*`). This is edge processing, not a deploy fault. Seen live on 2026-11-26.
- A failed request to `/cdn-cgi/rum` in a browser test that navigated away is Cloudflare RUM, not PostHog.

## Two domains, one build

Pages does not route by host, so every page answers on both domains: an English article on `graywolf.org.ua` and a Ukrainian article on `gulenok.lu` both render with 200. The canonical and `og:url` tags (CLAUDE.md › Domains) are the only signal of the intended host. Verified live on home, CV, tag, category, photography and article pages on 2026-11-03.

This leaves a duplicate-content risk:

- Relative internal links on the non-canonical host lead to that host's copies, which contradicts the canonical tags.
- There is no `hreflang` (rechecked on the home page 2026-11-26).
- A canonical tag is a hint to Google, not a redirect.

Before claiming Google chose the wrong copy, open Search Console URL Inspection and compare the Google-selected canonical with the user-declared one. If they differ, the fix is host-aware 301 redirects (English paths on `graywolf.org.ua` to `gulenok.lu`, Ukrainian paths on `gulenok.lu` to `graywolf.org.ua`). That is a separate design that needs approval: `_redirects` cannot match on host, and English and Ukrainian article paths share one shape (`/YYYY/MM/DD/slug`), so a Pages Function would need a build-time path-to-language map. The sitemap supports the canonical signal; it does not replace redirects.

`https://gulenok.lu/sitemap.xml` should be submitted in the `gulenok.lu` Search Console property. Whether that was done is not recorded (?).

When checking search rank, read the visible `<cite>` host of each result. Google result links are opaque `google.com` redirects and do not show the destination.

## Analytics (PostHog)

Configuration and the event table are in CLAUDE.md › PostHog Analytics.

- In a browser test, log `requestfailed`, non-2xx responses, console errors and every PostHog request.
- Playwright's HeadlessChrome is classed as a bot, so PostHog drops its captures. A headless test that records no events is not a production failure.
- To test ingestion from automation, run `posthog.set_config({ opt_out_useragent_filter: true })` in the page under test, send a harmless test event, and check that the POSTs to `/i/v0/e/` and `/s/` succeed. Never put this setting in the application code.
- `net::ERR_BLOCKED_BY_CLIENT` for `eu.i.posthog.com` comes from browser extensions or privacy shields. The mitigation is a same-origin reverse proxy, which is not in place.

## Flickr images on old Ukrainian articles

Images missing on old Ukrainian articles are usually Flickr throttling hotlinked photos, not a build fault.

Measured 2026-11-02:

- 1,236 Flickr references (1,197 unique URLs) in 90 published Ukrainian articles, none English, 14 of them in `image:` covers. The most per article: `pokhid-v-krym-traven-2008` 72, `subotnii-avtotur-kaniv-mory` 61, `park-kyiv-rus` 59.
- 12 of 12 sampled photos belong to Flickr user `ashenwolf`, the author.
- The 2018 Croatia article (`/2018/05/20/horvatiia-dlia-litnogo-vitpochynku/`) decoded 9 of 9 images in Chrome, 5 of them from Flickr.
- A site-wide sweep found 1,667 unique image sources, 105 unavailable across 49 pages. 33 are legacy `graywolf.org.ua/wp-content/…` paths, gone for good; the rest are dead third-party hosts and Flickr 404/410 URLs. These are permanent losses, unlike throttling.

How to check:

- One page: load it in a real browser (Playwright), scroll to the end, and record `requestfailed`, each image's response status, and `complete && naturalWidth > 0` per `<img>`. A curl 200 proves nothing under throttling, which also depends on Referer and user agent.
- Whole site: extract `src` from every built `<img>`, resolve local ones against `dist/`, and GET external ones with a browser user agent and a site Referer. Keep results per source and per page.

Lazy-loading does not help. Old Flickr tags have no width or height, collapse to 0 to 28 px before loading, and all 72 on the Crimea page load at once, with or without `loading="lazy"`. The image integration does not touch external images anyway.

Since `a5628d5`, `Article.astro` retries a failed image once and then shows a placeholder (CLAUDE.md › Layouts). Browser test with controlled Flickr failures on 2026-11-03: blocked requests showed placeholders; a failed first request recovered on retry; a 1-second outage recovered 72 of 72 Crimea thumbnails, against 0 on the previous build. This is cosmetic.

The durable fix is to self-host the photos from the author's own Flickr account, tracked as card `task-1793709644-e0267cf5c1350a4011a4-8256` with the full reference inventory. Third-party photos need their rights confirmed before anyone mirrors them.
