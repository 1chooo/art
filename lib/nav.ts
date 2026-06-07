export type NavLabelKey = "notes" | "projects" | "about" | "code";

export type NavItem =
  | {
      kind: "internal";
      href: "/notes" | "/projects" | "/about";
      labelKey: NavLabelKey;
    }
  | { kind: "external"; href: string; labelKey: NavLabelKey };

export const NAV_ITEMS: NavItem[] = [
  { kind: "internal", href: "/notes", labelKey: "notes" },
  { kind: "internal", href: "/projects", labelKey: "projects" },
  { kind: "internal", href: "/about", labelKey: "about" },
];
