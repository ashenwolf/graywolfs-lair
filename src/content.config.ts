import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "!**/*.excalidraw.md"],
    base: "src/content/articles",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(["en", "ua"]).default("en"),
    draft: z.boolean().default(false),
    description: z.string().nullish(),
    category: z.enum(["software-engineering", "travel", "life"]).optional(),
    image: z.string().nullish(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { articles, pages };
