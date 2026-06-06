import {
  Book,
  Camera,
  Code2,
  ExternalLink,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Play,
  Rss,
  Send,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  BENTO_SOCIAL_LINKS,
  type BentoSocialIcon,
} from "@/lib/bento-social";

const iconMap: Record<BentoSocialIcon, LucideIcon> = {
  code: Code2,
  share: Share2,
  location: MapPin,
  mail: Mail,
  globe: Globe,
  link: LinkIcon,
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
        const className = `${iconBox} bg-bento-bg p-3`;

        if (isExternalHref(href)) {
          return (
            <a
              key={`${href}-${label}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              aria-label={label}
            >
              <Icon className="size-5" strokeWidth={2.5} />
            </a>
          );
        }

        return (
          <Link
            key={`${href}-${label}`}
            href={href as "/location"}
            className={className}
            aria-label={label}
          >
            <Icon className="size-5" strokeWidth={2.5} />
          </Link>
        );
      })}
    </>
  );
}
