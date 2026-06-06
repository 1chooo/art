import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  getAvailableLocales,
  getProjectSlugs,
  resolveProjectFilename,
  type ProjectLocale,
  type ProjectMeta,
} from "@/lib/projects";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const filename = await resolveProjectFilename(slug, locale as ProjectLocale);
  if (!filename) return {};
  const { projectMeta } = await import(`@/content/projects/${filename}`);
  return {
    title: projectMeta.title,
    description: projectMeta.description,
  };
}

export default async function ProjectPage(props: Props) {
  const { slug, locale } = await props.params;
  const projectLocale = locale as ProjectLocale;
  const filename = await resolveProjectFilename(slug, projectLocale);
  if (!filename) notFound();

  const { default: MDXContent, projectMeta } = await import(
    `@/content/projects/${filename}`
  );
  const meta = projectMeta as ProjectMeta;
  const availableLocales = await getAvailableLocales(slug);
  const t = await getTranslations("project");

  const alternateLocale =
    availableLocales.length > 1
      ? availableLocales.find((l) => l !== projectLocale)
      : undefined;

  return (
    <article className="w-full bg-paper px-5 pb-[max(6rem,env(safe-area-inset-bottom))] pt-10 md:px-8 md:pb-24 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-10">
          <Link
            href="/projects"
            className="text-ink-muted hover:text-accent inline-flex min-h-11 items-center py-2 text-sm font-semibold transition-colors"
          >
            {t("back")}
          </Link>
        </nav>
        <header className="border-border mb-12 border-b pb-10">
          <p className="text-ink-muted mb-3 text-sm tracking-wide uppercase">
            {meta.year}
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
                href={`/projects/${slug}`}
                locale={alternateLocale}
                className="text-accent text-sm font-semibold hover:underline"
              >
                {t("readInLocale", { locale: alternateLocale })}
              </Link>
            </p>
          ) : null}
          {meta.url || meta.repo ? (
            <ul className="mt-6 flex flex-wrap gap-3">
              {meta.url ? (
                <li>
                  <a
                    href={meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent-soft text-accent rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase hover:opacity-90"
                  >
                    {t("visitSite")}
                  </a>
                </li>
              ) : null}
              {meta.repo ? (
                <li>
                  <a
                    href={meta.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent-soft text-accent rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase hover:opacity-90"
                  >
                    {t("viewRepo")}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
          {meta.tags && meta.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
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
      </div>
    </article>
  );
}
