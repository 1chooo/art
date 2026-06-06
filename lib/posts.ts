import type { ComponentType } from "react";
import HelloWorld, { postMeta as metaHello } from "@/content/posts/hello-world.mdx";
import OnMaking, { postMeta as metaMaking } from "@/content/posts/on-making.mdx";
import BuildingJournalEn, {
  postMeta as metaBuildingEn,
} from "@/content/posts/building-the-journal.en.mdx";
import BuildingJournalZh, {
  postMeta as metaBuildingZh,
} from "@/content/posts/building-the-journal.zh.mdx";
import BentoGapEn, { postMeta as metaGapEn } from "@/content/posts/bento-gap-rwd.en.mdx";
import BentoGapZh, { postMeta as metaGapZh } from "@/content/posts/bento-gap-rwd.zh.mdx";

/** Add new posts here after creating `content/posts/<slug>.mdx`. */
export type PostMeta = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
};

export type PostLocale = "en" | "zh";

export type PostLocaleContent = {
  meta: PostMeta;
  MDXContent: ComponentType;
};

export type PostEntry = {
  slug: string;
  /** Per-locale content; missing locale falls back to `en`. */
  locales: Partial<Record<PostLocale, PostLocaleContent>>;
};

export type ResolvedPostEntry = {
  slug: string;
  meta: PostMeta;
  MDXContent: ComponentType;
  availableLocales: PostLocale[];
};

const ENTRIES: PostEntry[] = [
  {
    slug: "hello-world",
    locales: { en: { meta: metaHello, MDXContent: HelloWorld } },
  },
  {
    slug: "on-making",
    locales: { en: { meta: metaMaking, MDXContent: OnMaking } },
  },
  {
    slug: "building-the-journal",
    locales: {
      en: { meta: metaBuildingEn, MDXContent: BuildingJournalEn },
      zh: { meta: metaBuildingZh, MDXContent: BuildingJournalZh },
    },
  },
  {
    slug: "bento-gap-rwd",
    locales: {
      en: { meta: metaGapEn, MDXContent: BentoGapEn },
      zh: { meta: metaGapZh, MDXContent: BentoGapZh },
    },
  },
];

/** Listing shape for home / navigation */
export type PostSummary = PostMeta & { slug: string };

function resolveLocaleContent(
  entry: PostEntry,
  locale: PostLocale,
): PostLocaleContent | null {
  return entry.locales[locale] ?? entry.locales.en ?? null;
}

export function getPostSlugs(): string[] {
  return ENTRIES.map((e) => e.slug);
}

export function getPostEntry(
  slug: string,
  locale: PostLocale = "en",
): ResolvedPostEntry | null {
  const entry = ENTRIES.find((e) => e.slug === slug);
  if (!entry) return null;

  const content = resolveLocaleContent(entry, locale);
  if (!content) return null;

  const availableLocales = (["en", "zh"] as const).filter(
    (l) => entry.locales[l],
  );

  return {
    slug: entry.slug,
    meta: content.meta,
    MDXContent: content.MDXContent,
    availableLocales,
  };
}

export function getAllPosts(locale: PostLocale = "en"): PostSummary[] {
  return [...ENTRIES]
    .map((e) => {
      const content = resolveLocaleContent(e, locale);
      if (!content) return null;
      return { slug: e.slug, ...content.meta };
    })
    .filter((p): p is PostSummary => p !== null)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export type TagStat = { tag: string; count: number };

/** Unique tags across all posts, sorted by frequency (desc) then name. */
export function getAllTags(): TagStat[] {
  const counts = new Map<string, number>();
  for (const e of ENTRIES) {
    const seen = new Set<string>();
    for (const content of Object.values(e.locales)) {
      if (!content) continue;
      for (const t of content.meta.tags ?? []) {
        if (!seen.has(t)) {
          seen.add(t);
          counts.set(t, (counts.get(t) ?? 0) + 1);
        }
      }
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
