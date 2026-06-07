import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getAvailableLocales,
  getPostSlugs,
  resolvePostFilename,
  type PostLocale,
  type PostMeta,
} from "@/lib/posts";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const filename = await resolvePostFilename(slug, locale as PostLocale);
  if (!filename) return {};
  const { postMeta } = await import(`@/content/posts/${filename}`);
  return {
    title: postMeta.title,
    description: postMeta.description,
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
  const postLocale = locale as PostLocale;
  const filename = await resolvePostFilename(slug, postLocale);
  if (!filename) notFound();

  const { default: MDXContent, postMeta } = await import(
    `@/content/posts/${filename}`
  );
  const meta = postMeta as PostMeta;
  const availableLocales = await getAvailableLocales(slug);
  const t = await getTranslations("post");

  const alternateLocale =
    availableLocales.length > 1
      ? availableLocales.find((l) => l !== postLocale)
      : undefined;

  return (
    <article className="w-full bg-paper px-5 pb-[max(6rem,env(safe-area-inset-bottom))] pt-10 md:px-8 md:pb-24 md:pt-16">
      <div className="mx-auto max-w-3xl">
      <nav className="mb-10">
        <Link
          href="/"
          className="text-ink-muted hover:text-accent inline-flex min-h-11 items-center py-2 text-sm font-semibold transition-colors"
        >
          {t("back")}
        </Link>
      </nav>
      <header className="border-border mb-12 border-b pb-10">
        <p className="text-ink-muted mb-3 text-sm tracking-wide uppercase">
          {formatDate(meta.date, locale)}
        </p>
        <h1 className="font-(family-name:--font-serif-display) text-ink mb-4 text-3xl leading-tight tracking-tight md:text-5xl">
          {meta.title}
        </h1>
        <p className="text-ink-muted text-base leading-relaxed md:text-xl">
          {meta.description}
        </p>
        {alternateLocale ? (
          <p className="mt-4">
            <Link
              href={`/notes/${slug}`}
              locale={alternateLocale}
              className="text-accent text-sm font-semibold hover:underline"
            >
              {t("readInLocale", { locale: alternateLocale })}
            </Link>
          </p>
        ) : null}
        {meta.tags && meta.tags.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/notes?tag=${encodeURIComponent(tag)}`}
                  className="bg-accent-soft text-accent rounded-full px-3 py-1 text-xs tracking-wide uppercase hover:opacity-90"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <div className="prose-blog">
        <MDXContent />
      </div>
      </div>
    </article>
  );
}
