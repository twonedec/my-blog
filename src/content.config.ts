import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    image: z.string().optional(),
    category: z.enum(['Travel & Kids', 'Life & Policy', 'Tech & Gear', 'Dev & Quant']),
  })
});

export const collections = {
  'posts': postsCollection,
};
