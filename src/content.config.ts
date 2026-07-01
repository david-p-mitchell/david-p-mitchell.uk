import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod"

const devdevotions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/devdevotions" }),
  schema: z.object({
    title: z.string(),
    verse: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    code: z.string(),
  }),
});

export const collections = { devdevotions };