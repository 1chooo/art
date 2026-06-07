import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { bentoCellHover } from "@/lib/bento-cell";
import { BENTO_QUICK_LINKS } from "@/lib/bento-links";

const cellClass = `text-bento-ink bg-bento-bg flex items-center justify-center p-3 text-center font-(family-name:--font-serif-display) text-sm font-bold md:text-base ${bentoCellHover}`;

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export async function BentoQuickLinks() {
  const t = await getTranslations("home.quickLinks");

  return (
    <>
      {BENTO_QUICK_LINKS.map(({ href, labelKey, wide }) => {
        const label = t(labelKey);
        const className = wide ? `${cellClass} col-span-2` : cellClass;

        if (isExternalHref(href)) {
          return (
            <a
              key={labelKey}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {label}
            </a>
          );
        }

        if (href.startsWith("mailto:")) {
          return (
            <a key={labelKey} href={href} className={className}>
              {label}
            </a>
          );
        }

        return (
          <Link
            key={labelKey}
            href={href as "/location"}
            className={className}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
