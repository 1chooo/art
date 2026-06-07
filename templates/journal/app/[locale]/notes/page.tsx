import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PostsSearch } from "@/components/posts/posts-search";
import { getAllPosts, getAllTags, type PostSummary } from "@/lib/posts";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string; q?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "notes" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "zh" ? "zh-Hant" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function postsQueryString(parts: { tag?: string; q?: string }) {
  const p = new URLSearchParams();
  if (parts.tag) p.set("tag", parts.tag);
  if (parts.q?.trim()) p.set("q", parts.q.trim());
  const s = p.toString();
  return s ? `?${s}` : "";
}

function groupPostsByYear(posts: PostSummary[]) {
  const byYear = new Map<number, PostSummary[]>();
  for (const post of posts) {
    const y = new Date(post.date).getFullYear();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(post);
  }
  return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
}

export default async function PostsPage(props: Props) {
  const { locale } = await props.params;
  const sp = await props.searchParams;
  const tag = typeof sp.tag === "string" ? sp.tag : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  const t = await getTranslations("notes");
  const all = await getAllPosts(locale as "en" | "zh");
  const tagStats = await getAllTags();
  const qLower = q?.trim().toLowerCase() ?? "";

  const filtered = all
    .filter((p) => !tag || p.tags?.includes(tag))
    .filter(
      (p) =>
        !qLower ||
        `${p.title} ${p.description}`.toLowerCase().includes(qLower) ||
        p.tags?.some((tg) => tg.toLowerCase().includes(qLower)),
    );

  const grouped = groupPostsByYear(filtered);
  const currentQ = q?.trim() ?? "";
  const hasFilters = Boolean(tag || currentQ);

  return (
    <div className="bg-paper w-full px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <header className="border-border mb-8 border-b pb-6 md:mb-10 md:pb-8">
          <h1 className="font-(family-name:--font-serif-display) text-ink mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="text-ink-muted mb-2 text-sm md:text-base">
            {t("description")}
          </p>
          <p className="text-ink-muted text-sm md:text-base">
            {t("count", { count: filtered.length })}
          </p>
        </header>

        <div className="mb-8 space-y-6">
          <Suspense
            fallback={
              <div
                className="border-border bg-surface h-11 w-full animate-pulse rounded-lg border"
                aria-hidden
              />
            }
          >
            <PostsSearch
              placeholder={t("searchPlaceholder")}
              defaultQuery={currentQ}
            />
          </Suspense>

          <div>
            <p className="text-ink-muted mb-3 text-xs font-bold uppercase tracking-[0.12em]">
              {t("tagsHeading")}
            </p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href={`/notes${postsQueryString({ q: currentQ || undefined })}`}
                  className={`rounded-full px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors md:py-1.5 md:text-sm ${
                    !tag
                      ? "bg-accent text-paper"
                      : "bg-accent-soft text-accent hover:opacity-90"
                  }`}
                >
                  {t("allTags")}
                </Link>
              </li>
              {tagStats.map((stat) => (
                <li key={stat.tag}>
                  <Link
                    href={`/notes${postsQueryString({ tag: stat.tag, q: currentQ || undefined })}`}
                    className={`rounded-full px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors md:py-1.5 md:text-sm ${
                      tag === stat.tag
                        ? "bg-accent text-paper"
                        : "bg-accent-soft text-accent hover:opacity-90"
                    }`}
                  >
                    {stat.tag}{" "}
                    <span className="opacity-80">({stat.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasFilters ? (
            <p>
              <Link
                href="/notes"
                className="text-accent text-sm font-semibold hover:underline"
              >
                {t("clearFilters")}
              </Link>
            </p>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <p className="text-ink-muted text-center text-base">{t("empty")}</p>
        ) : (
          <div className="space-y-12">
            {grouped.map(([year, posts]) => (
              <section key={year}>
                <h2 className="font-(family-name:--font-serif-display) text-ink-muted mb-6 text-2xl font-bold md:mb-6">
                  {year}
                </h2>
                <ul className="flex flex-col">
                  {posts.map((post) => (
                    <li
                      key={post.slug}
                      className="border-border flex flex-col border-b py-6 last:border-b-0 md:py-8"
                    >
                      <p className="text-ink-muted order-2 mb-2 text-sm md:order-1">
                        {formatDate(post.date, locale)}
                      </p>
                      <Link
                        href={`/notes/${post.slug}`}
                        className="font-(family-name:--font-serif-display) text-ink hover:text-accent order-1 text-2xl font-bold leading-tight transition-colors md:order-2 md:text-3xl"
                      >
                        {post.title}
                      </Link>
                      <p className="text-ink-muted order-3 mt-3 text-base leading-relaxed">
                        {post.description}
                      </p>
                      {post.tags && post.tags.length > 0 ? (
                        <ul className="order-4 mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tg) => (
                            <li key={tg}>
                              <Link
                                href={`/notes${postsQueryString({ tag: tg, q: currentQ || undefined })}`}
                                className="bg-accent-soft text-accent rounded-full px-2.5 py-1 text-xs font-medium tracking-wide uppercase hover:opacity-90"
                              >
                                {tg}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
