import type { ComponentType } from "react";
import HelloWorld, { postMeta as metaHello } from "@/content/posts/hello-world.mdx";
import OnMaking, { postMeta as metaMaking } from "@/content/posts/on-making.mdx";

/** Add new posts here after creating `src/content/posts/<slug>.mdx`. */
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
