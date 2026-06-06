export type NavLabelKey = "home" | "note" | "about" | "code";

export type NavItem =
  | { kind: "internal"; href: "/" | "/posts" | "/about"; labelKey: NavLabelKey }
  | { kind: "external"; href: string; labelKey: NavLabelKey };

export const NAV_ITEMS: NavItem[] = [
  { kind: "internal", href: "/", labelKey: "home" },
  { kind: "internal", href: "/posts", labelKey: "note" },
  { kind: "internal", href: "/about", labelKey: "about" },
  {
    kind: "external",
    href: "https://github.com/1chooo/art",
    labelKey: "code",
  },
];
