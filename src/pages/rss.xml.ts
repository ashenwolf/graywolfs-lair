import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { LOCALES, SITE } from "../constants/site";
import { loadPosts } from "../utils/posts";

export async function GET(context: APIContext) {
  return rss({
    title: SITE.author,
    description: LOCALES.en.home.lead,
    site: context.site ?? LOCALES.en.origin,
    items: (await loadPosts("en")).map(({ title, date, description, url }) => ({
      title,
      pubDate: date,
      description,
      link: url,
    })),
  });
}
