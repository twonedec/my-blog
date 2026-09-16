import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    updated: z.date().optional(),
    image: z.string().optional(),
    category: z.enum(['Travel & Kids', 'Life & Policy', 'Tech & Gear', 'Dev & Quant']),
    draft: z.boolean().optional().default(false),
    disclaimer: z.string().optional(),
    imageCredit: z.string().optional(),
    imagePosition: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
});

const labCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/lab" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    categoryBadge: z.string().optional().default("AI PROMPT"),
    tips: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  })
});

export const collections = {
  'posts': postsCollection,
  'lab': labCollection,
};
