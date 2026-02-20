import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getArticleUrl } from "../utils/articleUrls";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = (
    await getCollection("articles", ({ data }) => !data.draft && data.lang === "en")
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "Sergii Gulenok",
    description: "Thoughts on people, software engineering and people in software engineering.",
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description ?? undefined,
      link: getArticleUrl(article),
    })),
  });
}
