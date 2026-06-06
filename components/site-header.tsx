import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const tr = await getTranslations();
  return (
    <header className="bg-bento-bg sticky top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="relative flex items-center justify-between gap-4 px-4 pb-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="text-bento-ink text-lg md:text-xl">{tr("brand")}</span>
        </Link>

        <MobileNav />

        <nav className="hidden flex-wrap items-center justify-end gap-3 md:flex md:gap-6">
          <ul className="flex flex-wrap items-center gap-3 text-sm font-bold md:gap-5 md:text-base">
            <li>
              <Link href="/" className="text-bento-ink hover:underline">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/posts" className="text-bento-ink hover:underline">
                {t("note")}
              </Link>
            </li>
            <li>
              <a
                href="https://github.com"
                className="text-bento-ink hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("share")}
              </a>
            </li>
            <li>
              <a href="#intro" className="text-bento-ink hover:underline">
                {t("intro")}
              </a>
            </li>
          </ul>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
