import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

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

        <div className="prose-blog space-y-8">
          <p className="text-ink text-base leading-relaxed md:text-lg">
            {t("lead")}
          </p>

          <blockquote className="border-border text-ink-muted border-l-4 pl-4 italic">
            {t("philosophy")}
          </blockquote>

          <section>
            <h2 className="font-(family-name:--font-serif-display) text-ink mb-4 text-2xl font-bold">
              {t("backgroundHeading")}
            </h2>
            <p>{t("background")}</p>
          </section>

          <section>
            <h2 className="font-(family-name:--font-serif-display) text-ink mb-4 text-2xl font-bold">
              {t("workHeading")}
            </h2>
            <p>{t("work")}</p>
          </section>

          <section>
            <h2 className="font-(family-name:--font-serif-display) text-ink mb-4 text-2xl font-bold">
              {t("beyondHeading")}
            </h2>
            <p>{t("beyond")}</p>
          </section>

          <section>
            <h2 className="font-(family-name:--font-serif-display) text-ink mb-4 text-2xl font-bold">
              {t("projectsHeading")}
            </h2>
            <p>{t("projects")}</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="https://1chooo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  1chooo.com
                </a>
                {" — "}
                {t("project1chooo")}
              </li>
              <li>
                <a
                  href="https://github.com/1chooo/art"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  art
                </a>
                {" — "}
                {t("projectArt")}
              </li>
              <li>
                <a
                  href="https://github.com/1chooo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VCard
                </a>
                {" — "}
                {t("projectVCard")}
              </li>
            </ul>
          </section>

          <p className="text-ink-muted text-sm">
            {t("connect")}{" "}
            <a
              href="https://1chooo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              1chooo.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
