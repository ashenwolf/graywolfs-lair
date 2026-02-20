import type { CollectionEntry } from "astro:content";

export const countTags = (articles: CollectionEntry<"articles">[]): Map<string, number> =>
  articles.reduce((counts, article) => {
    for (const tag of article.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return counts;
  }, new Map<string, number>());

export const getSortedTags = (counts: Map<string, number>): [string, number][] =>
  [...counts.entries()].sort((a, b) => b[1] - a[1]);
