import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CobeGlobe } from "@/components/location/cobe-globe";
import { Link } from "@/i18n/navigation";
import { LOCATION_POINTS } from "@/lib/locations";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "location" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocationPage() {
  const t = await getTranslations("location");

  const labels = Object.fromEntries(
    LOCATION_POINTS.map((point) => [point.id, t(`cities.${point.id}`)]),
  );

  return (
    <div className="bg-paper w-full px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <header className="border-border mb-8 border-b pb-6 md:mb-10 md:pb-8">
          <p className="text-ink-muted mb-3 text-sm">
            <Link href="/" className="hover:underline">
              {t("back")}
            </Link>
          </p>
          <h1 className="font-(family-name:--font-serif-display) text-ink mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="text-ink-muted text-sm md:text-base">
            {t("description")}
          </p>
        </header>

        <CobeGlobe locations={LOCATION_POINTS} labels={labels} />

        <ul className="mt-10 space-y-4">
          {LOCATION_POINTS.map((point) => (
            <li
              key={point.id}
              className="border-border flex items-start gap-3 border-b pb-4 last:border-b-0"
            >
              <span
                className={`mt-1 size-2.5 shrink-0 rounded-full ${
                  point.current ? "bg-ink" : "bg-ink-muted"
                }`}
                aria-hidden
              />
              <div>
                <p className="text-ink font-medium">
                  {t(`cities.${point.id}`)}
                  {point.current ? (
                    <span className="text-ink-muted ml-2 text-sm font-normal">
                      {t("currentBadge")}
                    </span>
                  ) : null}
                </p>
                <p className="text-ink-muted text-sm">
                  {t(`cityNotes.${point.id}`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
