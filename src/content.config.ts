import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { CATEGORY_IDS, LANGS } from "./constants/site";

const articles = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "!**/*.excalidraw.md"],
    base: "src/content/articles",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(LANGS).default("en"),
    draft: z.boolean().default(false),
    description: z.string().nullish(),
    category: z.enum(CATEGORY_IDS).optional(),
    image: z.string().nullish(),
  }),
});

export const collections = { articles };
