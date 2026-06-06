import {
  Book,
  Camera,
  Code2,
  ExternalLink,
  Globe,
  Link,
  Mail,
  MessageCircle,
  Music,
  Play,
  Rss,
  Send,
  Share2,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  BENTO_SOCIAL_LINKS,
  type BentoSocialIcon,
} from "@/lib/bento-social";

const iconMap: Record<BentoSocialIcon, LucideIcon> = {
  code: Code2,
  share: Share2,
  video: Video,
  mail: Mail,
  globe: Globe,
  link: Link,
  rss: Rss,
  send: Send,
  message: MessageCircle,
  "external-link": ExternalLink,
  book: Book,
  camera: Camera,
  music: Music,
  play: Play,
};

const iconBox =
  "text-bento-ink hover:bg-bento-ink hover:text-bento-bg flex items-center justify-center transition-colors";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function BentoSocialIcons() {
  return (
    <>
      {BENTO_SOCIAL_LINKS.map(({ href, label, icon }) => {
        const Icon = iconMap[icon];
        const external = isExternalHref(href);

        return (
          <a
            key={`${href}-${label}`}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`${iconBox} bg-bento-bg p-3`}
            aria-label={label}
          >
            <Icon className="size-5" strokeWidth={2.5} />
          </a>
        );
      })}
    </>
  );
}
