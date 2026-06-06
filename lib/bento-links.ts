export type BentoLinkLabelKey = "location" | "github" | "email";

export type BentoQuickLink = {
  href: string;
  labelKey: BentoLinkLabelKey;
  /** Span both columns in the 2×2 quick-link grid */
  wide?: boolean;
};

/**
 * Homepage bento quick links — edit hrefs here; labels live in messages/*.json
 * under `home.quickLinks`.
 */
export const BENTO_QUICK_LINKS: BentoQuickLink[] = [
  { href: "/location", labelKey: "location" },
  { href: "https://github.com/1chooo", labelKey: "github" },
  { href: "mailto:hugo@1chooo.com", labelKey: "email", wide: true },
];
