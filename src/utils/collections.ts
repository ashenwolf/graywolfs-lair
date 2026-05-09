import type { GetStaticPathsOptions } from "astro";
import { getCollection } from "astro:content";
import type { Lang } from "../constants/labels";
import { getArticlesWithUrls, type ArticleWithUrl } from "./articleUrls";

export const getArticlesByLang = async (lang: Lang): Promise<ArticleWithUrl[]> => {
  const articles = await getCollection(
    "articles",
    ({ data }) => !data.draft && data.lang === lang,
  );
  return getArticlesWithUrls(
    articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()),
  );
};

export const makeTagPaths = async (lang: Lang, { paginate }: GetStaticPathsOptions) => {
  const articles = await getArticlesByLang(lang);
  const tags = new Set(articles.flatMap((a) => a.data.tags));
  return [...tags].flatMap((tag) => {
    const filtered = articles.filter((a) => a.data.tags.includes(tag));
    return paginate(filtered, { params: { tag }, pageSize: 20 });
  });
};

export const makeCategoryPaths = async (lang: Lang, { paginate }: GetStaticPathsOptions) => {
  const articles = await getArticlesByLang(lang);
  const categories = new Set(articles.map((a) => a.data.category).filter(Boolean) as string[]);
  return [...categories].flatMap((category) => {
    const filtered = articles.filter((a) => a.data.category === category);
    return paginate(filtered, { params: { category }, pageSize: 20 });
  });
};
