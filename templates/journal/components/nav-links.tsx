"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";

type Props = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

const linkClass = {
  desktop: "text-bento-ink hover:underline",
  mobile: "text-bento-ink flex min-h-11 items-center hover:underline",
} as const;

export function NavLinks({ variant, onNavigate }: Props) {
  const t = useTranslations("nav");
  const className = linkClass[variant];

  return (
    <>
      {NAV_ITEMS.map((item) => (
        <li key={item.labelKey}>
          {item.kind === "internal" ? (
            <Link href={item.href} onClick={onNavigate} className={className}>
              {t(item.labelKey)}
            </Link>
          ) : (
            <a
              href={item.href}
              onClick={onNavigate}
              className={className}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(item.labelKey)}
            </a>
          )}
        </li>
      ))}
    </>
  );
}
