import { getCollection, type CollectionEntry } from "astro:content";
import type { PaginateFunction } from "astro";

import { CATEGORIES, CATEGORY_IDS, LOCALES, type Category, type Lang } from "../constants/site";
import { articlePath, localPath } from "./urls";

/** An article as every page and component renders it. Built once, in `toPost`. */
export type Post = {
  url: string;
  lang: Lang;
  title: string;
  date: Date;
  description: string | undefined;
  cover: string | undefined;
  tags: { name: string; href: string }[];
  category: { id: Category; label: string; gradient: string } | undefined;
};

const toPost = (entry: CollectionEntry<"articles">): Post => {
  const { title, date, lang, tags, description, image, category } = entry.data;
  const spec = category && CATEGORIES[category];
  return {
    url: articlePath(entry.id, date),
    lang,
    title,
    date,
    description: description ?? undefined,
    cover: image || spec?.cover,
    tags: tags.map((name) => ({ name, href: localPath(lang, `/tag/${name}`) })),
    category: spec && { id: category, label: spec[lang].label, gradient: spec.gradient },
  };
};

/** Every article that gets a page, with its entry for rendering. Drafts too under `astro dev`, to preview by URL. */
export const loadArticles = async () =>
  (await getCollection("articles", ({ data }) => import.meta.env.DEV || !data.draft)).map((entry) => ({
    entry,
    post: toPost(entry),
  }));

/** Published articles in `lang`, newest first: the input of every listing, the footer and RSS. */
export const loadPosts = async (lang: Lang) =>
  (await getCollection("articles", ({ data }) => !data.draft && data.lang === lang))
    .map(toPost)
    // The URL breaks same-date ties: collection order varies per build, and pages would reshuffle on every deploy.
    .sort((a, b) => b.date.getTime() - a.date.getTime() || a.url.localeCompare(b.url));

/** Tags of `posts` with their use counts, most used first. */
export const tagCounts = (posts: Post[]) => {
  const counts = posts
    .flatMap((post) => post.tags)
    .reduce(
      (acc, tag) => acc.set(tag.name, { ...tag, count: (acc.get(tag.name)?.count ?? 0) + 1 }),
      new Map<string, Post["tags"][number] & { count: number }>(),
    );
  return [...counts.values()].sort((a, b) => b.count - a.count);
};

/** One home page section per category, in CATEGORY_IDS order. */
export const homeSections = (posts: Post[], lang: Lang) =>
  CATEGORY_IDS.map((id) => ({
    title: CATEGORIES[id][lang].label,
    blurb: CATEGORIES[id][lang].blurb,
    href: localPath(lang, `/category/${id}`),
    posts: posts.filter((post) => post.category?.id === id).slice(0, 4),
  }));

type Listing = { params: Record<string, string>; heading: string; posts: Post[] };

const paginateListings = (listings: Listing[], paginate: PaginateFunction) =>
  listings.flatMap(({ params, heading, posts }) =>
    paginate(posts, { params, props: { heading }, pageSize: 20 }),
  );

/** `/tag/<tag>` pages: one paginated listing per tag used in `lang`. */
export const tagPaths = async (lang: Lang, paginate: PaginateFunction) => {
  const posts = await loadPosts(lang);
  const tags = new Set(posts.flatMap((post) => post.tags.map(({ name }) => name)));
  return paginateListings(
    [...tags].map((tag) => ({
      params: { tag },
      heading: `${LOCALES[lang].ui.tag}: ${tag}`,
      posts: posts.filter((post) => post.tags.some(({ name }) => name === tag)),
    })),
    paginate,
  );
};

/** `/category/<id>` pages: one paginated listing per category with posts in `lang`. */
export const categoryPaths = async (lang: Lang, paginate: PaginateFunction) => {
  const posts = await loadPosts(lang);
  return paginateListings(
    CATEGORY_IDS.map((category) => ({
      params: { category },
      heading: CATEGORIES[category][lang].label,
      posts: posts.filter((post) => post.category?.id === category),
    })).filter((listing) => listing.posts.length > 0),
    paginate,
  );
};
