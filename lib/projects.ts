import { access, readdir, readFile } from "fs/promises";
import { join } from "path";
import type { ComponentType } from "react";
import { PROJECTS_DIRECTORY } from "@/lib/path";

export type ProjectMeta = {
  title: string;
  year: string;
  description: string;
  featured?: boolean;
  url?: string;
  repo?: string;
  tags?: string[];
};

export type ProjectLocale = "en" | "zh";

export type ProjectLocaleContent = {
  meta: ProjectMeta;
  MDXContent: ComponentType;
};

type ProjectIndexEntry = {
  slug: string;
  locales: Partial<Record<ProjectLocale, ProjectMeta>>;
};

export type ResolvedProjectEntry = {
  slug: string;
  meta: ProjectMeta;
  MDXContent: ComponentType;
  availableLocales: ProjectLocale[];
};

export type ProjectSummary = ProjectMeta & { slug: string };

type ParsedFilename = { slug: string; locale: ProjectLocale; filename: string };

function parseFilename(file: string): ParsedFilename | null {
  if (!file.endsWith(".mdx")) return null;
  const base = file.slice(0, -4);
  const localized = base.match(/^(.+)\.(en|zh)$/);
  if (localized) {
    return {
      slug: localized[1],
      locale: localized[2] as ProjectLocale,
      filename: file,
    };
  }
  return { slug: base, locale: "en", filename: file };
}

function parseProjectMeta(content: string): ProjectMeta | null {
  const match = content.match(
    /export\s+const\s+projectMeta\s*=\s*\{([\s\S]*?)\n\}/,
  );
  if (!match) return null;
  const block = match[1];
  const title = block.match(/title\s*:\s*["'`](.*?)["'`]/)?.[1];
  const year = block.match(/year\s*:\s*["'`](.*?)["'`]/)?.[1];
  const description = block.match(
    /description\s*:\s*[\s\S]*?["'`](.*?)["'`]/,
  )?.[1];
  if (!title || !year || !description) return null;

  const featured = /featured\s*:\s*true/.test(block);
  const url = block.match(/url\s*:\s*["'`](.*?)["'`]/)?.[1];
  const repo = block.match(/repo\s*:\s*["'`](.*?)["'`]/)?.[1];

  const tagsMatch = block.match(/tags\s*:\s*\[([\s\S]*?)\]/);
  const tags = tagsMatch
    ? [...tagsMatch[1].matchAll(/["'`](.*?)["'`]/g)].map((m) => m[1])
    : undefined;

  return { title, year, description, featured, url, repo, tags };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function resolveProjectFilename(
  slug: string,
  locale: ProjectLocale,
): Promise<string | null> {
  const candidates = [
    `${slug}.${locale}.mdx`,
    ...(locale !== "en" ? [`${slug}.en.mdx`] : []),
    `${slug}.mdx`,
  ];
  for (const name of candidates) {
    if (await fileExists(join(PROJECTS_DIRECTORY, name))) return name;
  }
  return null;
}

async function importProject(filename: string): Promise<ProjectLocaleContent> {
  const mod = await import(`@/content/projects/${filename}`);
  return { meta: mod.projectMeta, MDXContent: mod.default };
}

let entriesPromise: Promise<ProjectIndexEntry[]> | null = null;

async function loadEntries(): Promise<ProjectIndexEntry[]> {
  let files: string[];
  try {
    files = await readdir(PROJECTS_DIRECTORY);
  } catch {
    return [];
  }

  const bySlug = new Map<string, ProjectIndexEntry>();

  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed) continue;

    const content = await readFile(join(PROJECTS_DIRECTORY, file), "utf-8");
    const meta = parseProjectMeta(content);
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

function getEntries(): Promise<ProjectIndexEntry[]> {
  entriesPromise ??= loadEntries();
  return entriesPromise;
}

function resolveLocaleMeta(
  entry: ProjectIndexEntry,
  locale: ProjectLocale,
): ProjectMeta | null {
  return entry.locales[locale] ?? entry.locales.en ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const entries = await getEntries();
  return entries.map((e) => e.slug);
}

export async function getAvailableLocales(
  slug: string,
): Promise<ProjectLocale[]> {
  const entries = await getEntries();
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return [];
  return (["en", "zh"] as const).filter((l) => entry.locales[l]);
}

export async function getProjectEntry(
  slug: string,
  locale: ProjectLocale = "en",
): Promise<ResolvedProjectEntry | null> {
  const entries = await getEntries();
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return null;

  const filename = await resolveProjectFilename(slug, locale);
  if (!filename) return null;

  const { meta, MDXContent } = await importProject(filename);
  const availableLocales = (["en", "zh"] as const).filter(
    (l) => entry.locales[l],
  );

  return {
    slug: entry.slug,
    meta,
    MDXContent,
    availableLocales,
  };
}

export async function getAllProjects(
  locale: ProjectLocale = "en",
): Promise<ProjectSummary[]> {
  const entries = await getEntries();
  return entries
    .map((e) => {
      const meta = resolveLocaleMeta(e, locale);
      if (!meta) return null;
      return { slug: e.slug, ...meta };
    })
    .filter((p): p is ProjectSummary => p !== null)
    .sort((a, b) => {
      const featuredDiff = Number(b.featured) - Number(a.featured);
      if (featuredDiff !== 0) return featuredDiff;
      return b.year.localeCompare(a.year) || a.title.localeCompare(b.title);
    });
}

export async function getFeaturedProjects(
  locale: ProjectLocale = "en",
  limit = 5,
): Promise<ProjectSummary[]> {
  const all = await getAllProjects(locale);
  const featured = all.filter((p) => p.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}
