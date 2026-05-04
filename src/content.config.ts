import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    canonicalUrl: z.string().url().optional().nullable(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.string(),
    tags: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    website: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

const packages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/packages' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    ecosystem: z.string(),
    category: z.string(),
    language: z.string(),
    frameworks: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    registry: z.string().url().optional(),
    install: z.string(),
    status: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, packages };
