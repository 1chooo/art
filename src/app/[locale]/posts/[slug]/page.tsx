import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPostEntry, getPostSlugs } from "@/lib/posts";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const entry = getPostEntry(slug);
  if (!entry) return {};
  return {
    title: entry.meta.title,
    description: entry.meta.description,
  };
}

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "zh" ? "zh-Hant" : "en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function PostPage(props: Props) {
  const { slug, locale } = await props.params;
  const entry = getPostEntry(slug);
  if (!entry) notFound();

  const { meta, MDXContent } = entry;
  const t = await getTranslations("post");

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <nav className="mb-10">
        <Link
          href="/"
          className="text-ink-muted hover:text-accent text-sm transition-colors"
        >
          {t("back")}
        </Link>
      </nav>
      <header className="border-border mb-12 border-b pb-10">
        <p className="text-ink-muted mb-3 text-sm tracking-wide uppercase">
          {formatDate(meta.date, locale)}
        </p>
        <h1 className="font-[family-name:var(--font-serif-display)] text-ink mb-4 text-4xl leading-tight tracking-tight md:text-5xl">
          {meta.title}
        </h1>
        <p className="text-ink-muted text-lg leading-relaxed md:text-xl">
          {meta.description}
        </p>
        {meta.tags && meta.tags.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <li key={tag}>
                <span className="bg-accent-soft text-accent rounded-full px-3 py-1 text-xs tracking-wide uppercase">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <div className="prose-blog">
        <MDXContent />
      </div>
    </article>
  );
}
