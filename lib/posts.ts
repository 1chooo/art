import type { ComponentType } from "react";
import HelloWorld, { postMeta as metaHello } from "@/content/posts/hello-world.mdx";
import OnMaking, { postMeta as metaMaking } from "@/content/posts/on-making.mdx";

/** Add new posts here after creating `content/posts/<slug>.mdx`. */
export type PostMeta = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
};

export type PostEntry = {
  slug: string;
  meta: PostMeta;
  MDXContent: ComponentType;
};

const ENTRIES: PostEntry[] = [
  { slug: "hello-world", meta: metaHello, MDXContent: HelloWorld },
  { slug: "on-making", meta: metaMaking, MDXContent: OnMaking },
];

/** Listing shape for home / navigation */
export type PostSummary = PostMeta & { slug: string };

export function getPostSlugs(): string[] {
  return ENTRIES.map((e) => e.slug);
}

export function getPostEntry(slug: string): PostEntry | null {
  return ENTRIES.find((e) => e.slug === slug) ?? null;
}

export function getAllPosts(): PostSummary[] {
  return [...ENTRIES]
    .sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
    )
    .map((e) => ({ slug: e.slug, ...e.meta }));
}

export type TagStat = { tag: string; count: number };

/** Unique tags across all posts, sorted by frequency (desc) then name. */
export function getAllTags(): TagStat[] {
  const counts = new Map<string, number>();
  for (const e of ENTRIES) {
    for (const t of e.meta.tags ?? []) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
