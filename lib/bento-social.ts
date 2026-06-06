/**
 * Icons available for the homepage bento social grid.
 * Each key maps to a Lucide icon in `BentoSocialIcons`.
 */
export type BentoSocialIcon =
  | "code"
  | "share"
  | "video"
  | "mail"
  | "globe"
  | "link"
  | "rss"
  | "send"
  | "message"
  | "external-link"
  | "book"
  | "camera"
  | "music"
  | "play";

export type BentoSocialLink = {
  /** Link URL — use `mailto:` for email */
  href: string;
  /** Accessible label (screen readers) */
  label: string;
  icon: BentoSocialIcon;
};

/**
 * Homepage bento social grid (2×2 on desktop).
 * Edit this list to choose which links and icons appear.
 */
export const BENTO_SOCIAL_LINKS: BentoSocialLink[] = [
  {
    href: "https://github.com/1chooo",
    label: "GitHub",
    icon: "code",
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: "share",
  },
  {
    href: "#",
    label: "Video",
    icon: "video",
  },
  {
    href: "mailto:hugo@1chooo.com",
    label: "Email",
    icon: "mail",
  },
];
