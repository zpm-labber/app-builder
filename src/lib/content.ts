import type { CollectionEntry } from 'astro:content';

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function readingTime(post: CollectionEntry<'blog'>) {
  const words = post.body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function byDateDesc(
  a: CollectionEntry<'blog'>,
  b: CollectionEntry<'blog'>,
) {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function slugFromEntry(entry: { id: string }) {
  return entry.id.replace(/\.(md|mdx)$/i, '');
}
