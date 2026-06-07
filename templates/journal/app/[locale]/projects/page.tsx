import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllProjects } from "@/lib/projects";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProjectsPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations("projects");
  const all = await getAllProjects(locale as "en" | "zh");
  const featured = all.filter((p) => p.featured);
  const mini = all.filter((p) => !p.featured);

  return (
    <div className="bg-paper w-full px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <header className="border-border mb-8 border-b pb-6 md:mb-10 md:pb-8">
          <h1 className="font-(family-name:--font-serif-display) text-ink mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="text-ink-muted text-sm md:text-base">
            {t("description")}
          </p>
        </header>

        {featured.length > 0 ? (
          <div className="space-y-12">
            {featured.map((project) => (
              <section key={project.slug}>
                <h2 className="font-(family-name:--font-serif-display) text-ink mb-4 text-2xl font-bold md:text-3xl">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="text-ink-muted text-base leading-relaxed md:text-lg">
                  {project.description}
                </p>
                <p className="mt-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-accent text-sm font-semibold hover:underline"
                  >
                    {t("readMore")}
                  </Link>
                </p>
              </section>
            ))}
          </div>
        ) : null}

        {mini.length > 0 ? (
          <section className={featured.length > 0 ? "mt-16" : ""}>
            {featured.length > 0 ? (
              <hr className="border-border mb-10" />
            ) : null}
            <p className="text-ink-muted mb-6 text-base">{t("miniHeading")}</p>
            <ul className="space-y-3">
              {mini.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-ink hover:text-accent font-semibold transition-colors"
                  >
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {all.length === 0 ? (
          <p className="text-ink-muted text-center text-base">{t("empty")}</p>
        ) : null}
      </div>
    </div>
  );
}
