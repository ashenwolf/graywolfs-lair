import rss from "@astrojs/rss";
import { getArticlesByLang } from "../utils/collections";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const articles = await getArticlesByLang("en");

  return rss({
    title: "Sergii Gulenok",
    description: "Thoughts on people, software engineering and people in software engineering.",
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description ?? undefined,
      link: article.url,
    })),
  });
}
