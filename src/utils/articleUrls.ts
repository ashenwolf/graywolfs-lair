import type { CollectionEntry } from "astro:content";

export function getArticleUrl(article: CollectionEntry<"articles">): string {
  const date = new Date(article.data.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Extract slug from article ID (e.g., "en/hello-world" -> "hello-world")
  const slugParts = article.id.split("/");
  const slug = slugParts[slugParts.length - 1].replace(".md", "");

  return `/${year}/${month}/${day}/${slug}`;
}

export function getArticlesWithUrls(
  articles: CollectionEntry<"articles">[],
): (CollectionEntry<"articles"> & { url: string })[] {
  return articles.map((article) => ({
    ...article,
    url: getArticleUrl(article),
  }));
}
