import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${sans.className} bg-black text-bento-ink min-h-dvh font-(family-name:--font-sans-body) antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
            {/* <SiteFooter /> */}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
