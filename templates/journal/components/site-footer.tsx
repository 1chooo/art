import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-black py-8 text-center">
      <p className="text-bento-bg text-sm font-bold uppercase tracking-wide">
        {t("note")}
      </p>
    </footer>
  );
}
