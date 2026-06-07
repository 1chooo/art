import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { getFeaturedProjects } from "@/lib/projects";
import { getWeather } from "@/lib/weather";
import { BentoLabel } from "@/components/bento/bento-label";
import {
  bentoCellGroup,
  bentoCellHover,
  bentoCellInvertedHover,
} from "@/lib/bento-cell";
import { BentoQuickLinks } from "@/components/bento/bento-quick-links";
import { ImageCarousel } from "@/components/bento/image-carousel";
import { TagCarousel } from "@/components/bento/tag-carousel";
import { UpcomingCarousel } from "@/components/bento/upcoming-carousel";

export async function HomeBento() {
  const locale = (await getLocale()) as "en" | "zh";
  const t = await getTranslations("home");
  const tm = await getTranslations("metadata");
  const tr = await getTranslations();
  const posts = await getAllPosts(locale);
  const projects = await getFeaturedProjects(locale);
  const tagNames = (await getAllTags()).map((s) => s.tag);
  const weather = await getWeather();
  const latest = posts[0];
  const upcomingSlides =
    posts.length > 0
      ? posts.slice(0, 5).map((p) => ({
        title: p.title,
        description: p.description,
      }))
      : [
        {
          title: t("upcomingFallbackTitle"),
          description: t("upcomingFallbackDesc"),
        },
      ];

  const projectSlides =
    projects.length > 0
      ? projects.map((p) => ({
          title: p.title,
          description: p.description,
          href: `/projects/${p.slug}`,
        }))
      : [
          {
            title: t("projectFallbackTitle"),
            description: t("projectFallbackDesc"),
            href: "/projects" as const,
          },
        ];

  const heroImages = [
    { src: "/opengraph-image.png", alt: "Gallery" },
    { src: "/opengraph-image.png", alt: "Gallery slide 2" },
  ];

  return (
    <div className="flex flex-1 flex-col bg-black p-bento-gap">
      {/*
        Desktop: 12-col grid, 3 rows, strict 50/50 split (6+6)
        Row 1: Copyright(3)+Tag(3) | Upcoming(6)
        Row 2: Image(6)            | Project(3)+Author/Social/Weather(3)
        Row 3: Quote(6)            | CTA(6)
      */}
      <div className="grid flex-1 grid-cols-1 gap-bento-gap bg-black md:grid-cols-12 md:grid-rows-[auto_1fr_auto]">
        {/* ── Row 1 ── */}

        {/* Copyright */}
        <section
          className={`order-1 flex flex-col items-center justify-center p-4 text-center md:order-0 md:col-span-3 md:p-5 ${bentoCellGroup}`}
        >
          <BentoLabel>{t("copyrightLabel")}</BentoLabel>
          <p className="font-(family-name:--font-serif-display) text-xl font-bold md:text-2xl">
            {tr("brand")}
          </p>
          <p className="mt-2 max-w-xs text-sm font-medium opacity-70 md:hidden">
            {tm("description")}
          </p>
        </section>

        {/* Tag — cycles all tags from posts; click opens /notes?tag= */}
        <TagCarousel
          tags={tagNames}
          label={t("tagLabel")}
          tagFallback={t("tagFallback")}
          className="order-7 md:order-0"
        />

        {/* Upcoming */}
        <section className="bg-bento-bg order-2 flex flex-col md:order-0 md:col-span-6">
          <UpcomingCarousel
            slides={upcomingSlides}
            prevLabel={t("carouselPrev")}
            nextLabel={t("carouselNext")}
            label={t("upcomingLabel")}
          />
        </section>

        {/* ── Row 2 ── */}

        {/* Hero image */}
        <div className="bg-bento-bg order-5 md:order-0 md:col-span-6 md:row-start-2">
          <ImageCarousel
            images={heroImages}
            prevLabel={t("carouselPrev")}
            nextLabel={t("carouselNext")}
          />
        </div>

        {/* Project carousel */}
        <section className="bg-bento-bg order-4 flex flex-col md:order-0 md:col-span-3 md:row-start-2">
          <UpcomingCarousel
            slides={projectSlides}
            prevLabel={t("carouselPrev")}
            nextLabel={t("carouselNext")}
            label={t("projectLabel")}
          />
        </section>

        {/* Author + Social + Weather — nested sub-grid */}
        <div className="order-6 grid grid-cols-2 gap-bento-gap bg-black md:order-0 md:col-span-3 md:row-start-2">
          {/* Author name */}
          <Link
            href="/about"
            className={`col-span-2 hidden flex-col items-center justify-center bg-bento-bg p-3 text-center md:flex ${bentoCellHover}`}
          >
            <BentoLabel>{t("authorLabel")}</BentoLabel>
            <p className="font-(family-name:--font-serif-display) text-lg font-bold">
              {tr("brand")}
            </p>
          </Link>

          {/* Quick links — customize in lib/bento-links.ts */}
          <BentoQuickLinks />

          {/* Weather */}
          <div
            className={`col-span-2 flex flex-1 flex-col items-center justify-center bg-bento-bg p-3 text-center ${bentoCellHover}`}
          >
            <BentoLabel>{t("weatherLabel")}</BentoLabel>
            <p className="font-(family-name:--font-serif-display) text-base font-bold md:text-lg">
              {weather
                ? t("weatherLine", {
                    temp: weather.temperature,
                    condition: t(`weatherConditions.${weather.condition}`),
                  })
                : t("weatherUnavailable")}
            </p>
          </div>
        </div>

        {/* ── Row 3 ── */}

        {/* Quote — black background, white text */}
        <section
          className={`bg-bento-ink text-bento-bg order-8 flex items-center justify-center p-6 text-center md:order-0 md:col-span-6 md:row-start-3 md:p-8 ${bentoCellInvertedHover}`}
        >
          <p className="font-(family-name:--font-serif-display) max-w-xl text-lg font-bold md:text-xl">
            {t("quote")}
          </p>
        </section>

        {/* CTA */}
        <section
          className={`order-3 flex items-center justify-center p-6 text-center md:order-0 md:col-span-6 md:row-start-3 md:p-8 ${bentoCellGroup}`}
        >
          {latest ? (
            <Link
              href={`/notes/${latest.slug}`}
              className="font-(family-name:--font-serif-display) inline-block text-lg font-bold md:text-2xl"
            >
              {t("cta")}
            </Link>
          ) : (
            <span className="font-(family-name:--font-serif-display) text-lg font-bold opacity-50 md:text-2xl">
              {t("cta")}
            </span>
          )}
        </section>
      </div>
    </div>
  );
}
