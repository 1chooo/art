"use client";

import { useState } from "react";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";

export type TagDemoPost = {
  slug: string;
  title: string;
  tags?: string[];
};

type TagDemoProps = {
  posts: TagDemoPost[];
  tags: string[];
  locale?: "en" | "zh";
};

const labels = {
  en: { heading: "Try filtering by tag", all: "All", empty: "No posts match this tag." },
  zh: { heading: "試試用標籤篩選", all: "全部", empty: "沒有符合此標籤的文章。" },
} as const;

export function TagDemo({ posts, tags, locale = "en" }: TagDemoProps) {
  const t = labels[locale];
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  return (
    <div className="border-border my-8 rounded-lg border p-5">
      <p className="text-ink-muted mb-3 text-xs font-bold uppercase tracking-[0.12em]">
        {t.heading}
      </p>
      <ul className="mb-5 flex flex-wrap gap-2">
        <li>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              !activeTag
                ? "bg-accent text-paper"
                : "bg-accent-soft text-accent hover:opacity-90",
            )}
          >
            {t.all}
          </button>
        </li>
        {tags.map((tag) => (
          <li key={tag}>
            <button
              type="button"
              onClick={() => setActiveTag(tag)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                activeTag === tag
                  ? "bg-accent text-paper"
                  : "bg-accent-soft text-accent hover:opacity-90",
              )}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
      <ul className="space-y-3">
        {filtered.map((post) => (
          <li
            key={post.slug}
            className="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-3 last:border-b-0 last:pb-0"
          >
            <Link
              href={`/notes/${post.slug}`}
              className="text-ink hover:text-accent font-medium transition-colors"
            >
              {post.title}
            </Link>
            <span className="text-ink-muted text-xs">
              {post.tags?.join(", ")}
            </span>
          </li>
        ))}
      </ul>
      {filtered.length === 0 ? (
        <p className="text-ink-muted mt-3 text-sm">{t.empty}</p>
      ) : null}
    </div>
  );
}
