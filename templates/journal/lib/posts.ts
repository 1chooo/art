import { access, readdir, readFile } from "fs/promises";
import { join } from "path";
import type { ComponentType } from "react";
import { POSTS_DIRECTORY } from "@/lib/path";

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

type PostIndexEntry = {
  slug: string;
  locales: Partial<Record<PostLocale, PostMeta>>;
};

export type ResolvedPostEntry = {
  slug: string;
  meta: PostMeta;
  MDXContent: ComponentType;
  availableLocales: PostLocale[];
};

/** Listing shape for home / navigation */
export type PostSummary = PostMeta & { slug: string };

export type TagStat = { tag: string; count: number };

type ParsedFilename = { slug: string; locale: PostLocale; filename: string };

function parseFilename(file: string): ParsedFilename | null {
  if (!file.endsWith(".mdx")) return null;
  const base = file.slice(0, -4);
  const localized = base.match(/^(.+)\.(en|zh)$/);
  if (localized) {
    return {
      slug: localized[1],
      locale: localized[2] as PostLocale,
      filename: file,
    };
  }
  return { slug: base, locale: "en", filename: file };
}

/** Regex-parse `postMeta` for listings (same idea as 1chooo.com `get-posts.ts`). */
function parsePostMeta(content: string): PostMeta | null {
  const match = content.match(/export\s+const\s+postMeta\s*=\s*\{([\s\S]*?)\n\}/);
  if (!match) return null;
  const block = match[1];
  const title = block.match(/title\s*:\s*["'`](.*?)["'`]/)?.[1];
  const date = block.match(/date\s*:\s*["'`](.*?)["'`]/)?.[1];
  const description = block.match(
    /description\s*:\s*[\s\S]*?["'`](.*?)["'`]/,
  )?.[1];
  if (!title || !date || !description) return null;

  const tagsMatch = block.match(/tags\s*:\s*\[([\s\S]*?)\]/);
  const tags = tagsMatch
    ? [...tagsMatch[1].matchAll(/["'`](.*?)["'`]/g)].map((m) => m[1])
    : undefined;

  return { title, date, description, tags };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function resolvePostFilename(
  slug: string,
  locale: PostLocale,
): Promise<string | null> {
  const candidates = [
    `${slug}.${locale}.mdx`,
    ...(locale !== "en" ? [`${slug}.en.mdx`] : []),
    `${slug}.mdx`,
  ];
  for (const name of candidates) {
    if (await fileExists(join(POSTS_DIRECTORY, name))) return name;
  }
  return null;
}

async function importPost(filename: string): Promise<PostLocaleContent> {
  const mod = await import(`@/content/posts/${filename}`);
  return { meta: mod.postMeta, MDXContent: mod.default };
}

let entriesPromise: Promise<PostIndexEntry[]> | null = null;

async function loadEntries(): Promise<PostIndexEntry[]> {
  let files: string[];
  try {
    files = await readdir(POSTS_DIRECTORY);
  } catch {
    return [];
  }

  const bySlug = new Map<string, PostIndexEntry>();

  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed) continue;

    const content = await readFile(join(POSTS_DIRECTORY, file), "utf-8");
    const meta = parsePostMeta(content);
    if (!meta) continue;

    let entry = bySlug.get(parsed.slug);
    if (!entry) {
      entry = { slug: parsed.slug, locales: {} };
      bySlug.set(parsed.slug, entry);
    }
    entry.locales[parsed.locale] = meta;
  }

  return [...bySlug.values()];
}

function getEntries(): Promise<PostIndexEntry[]> {
  entriesPromise ??= loadEntries();
  return entriesPromise;
}

function resolveLocaleMeta(
  entry: PostIndexEntry,
  locale: PostLocale,
): PostMeta | null {
  return entry.locales[locale] ?? entry.locales.en ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  const entries = await getEntries();
  return entries.map((e) => e.slug);
}

export async function getAvailableLocales(slug: string): Promise<PostLocale[]> {
  const entries = await getEntries();
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return [];
  return (["en", "zh"] as const).filter((l) => entry.locales[l]);
}

export async function getPostEntry(
  slug: string,
  locale: PostLocale = "en",
): Promise<ResolvedPostEntry | null> {
  const entries = await getEntries();
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return null;

  const filename = await resolvePostFilename(slug, locale);
  if (!filename) return null;

  const { meta, MDXContent } = await importPost(filename);
  const availableLocales = (["en", "zh"] as const).filter((l) => entry.locales[l]);

  return {
    slug: entry.slug,
    meta,
    MDXContent,
    availableLocales,
  };
}

export async function getAllPosts(locale: PostLocale = "en"): Promise<PostSummary[]> {
  const entries = await getEntries();
  return entries
    .map((e) => {
      const meta = resolveLocaleMeta(e, locale);
      if (!meta) return null;
      return { slug: e.slug, ...meta };
    })
    .filter((p): p is PostSummary => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Unique tags across all posts, sorted by frequency (desc) then name. */
export async function getAllTags(): Promise<TagStat[]> {
  const entries = await getEntries();
  const counts = new Map<string, number>();
  for (const e of entries) {
    const seen = new Set<string>();
    for (const meta of Object.values(e.locales)) {
      if (!meta) continue;
      for (const t of meta.tags ?? []) {
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
