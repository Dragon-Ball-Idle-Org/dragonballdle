import { Header } from "@/components/ui/Header";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactUsProvider } from "./providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "contact.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    alternates: {
      canonical: `https://dragonballdle.site/${lang}/legal/`,
      languages: {
        "x-default": `https://dragonballdle.site/${routing.defaultLocale}/legal/`,
        ...Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            `https://dragonballdle.site/${locale}/legal/`,
          ]),
        ),
      },
    },
  };
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function ContactLayout({
  children,
}: LayoutProps<"/[lang]/contact-us">) {
  return (
    <ContactUsProvider>
      <Header />
      {children}
    </ContactUsProvider>
  );
}
