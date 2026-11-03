import { LANGS, type Lang } from "../constants/site";
import { loadPosts } from "../utils/posts";
import { absoluteUrl, localPath } from "../utils/urls";

// Pages are served at their trailing-slash URL and the canonical tag declares that form, so the sitemap must too.
const canonical = (lang: Lang, path: string) => absoluteUrl(lang, path.replace(/\/?$/, "/"));

/** Home pages, the English CV and every published article, each on its own language's domain. Both robots.txt files
 * name this one sitemap. Tag and category listings are left to links. */
export async function GET() {
  const posts = (await Promise.all(LANGS.map(loadPosts))).flat();
  const urls = [
    ...LANGS.map((lang) => canonical(lang, localPath(lang))),
    canonical("en", "/cv"),
    ...posts.map(({ lang, url }) => canonical(lang, url)),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    "</urlset>",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
