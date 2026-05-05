"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import clsx from "clsx";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div
      className="border-bento-ink flex gap-0 border-2 text-xs font-bold uppercase"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={clsx(
            "px-2 py-1 transition-colors",
            locale === loc
              ? "bg-bento-ink text-bento-bg"
              : "hover:bg-bento-ink/10 text-bento-ink",
          )}
        >
          {loc === "zh" ? "中" : "EN"}
        </Link>
      ))}
    </div>
  );
}
