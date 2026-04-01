import { Header } from "@/components/ui/Header";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClassicProviders } from "./providers";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "home.metadata" });

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
      canonical: `https://dragonballdle.site/${lang}/classic/`,
      languages: {
        "x-default": `https://dragonballdle.site/${routing.defaultLocale}/classic/`,
        ...Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            `https://dragonballdle.site/${locale}/classic/`,
          ]),
        ),
      },
    },
  };
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}
export default async function ClassicLayout({
  children,
  params,
}: LayoutProps<"/[lang]/classic">) {
  const { lang } = await params;

  return (
    <ClassicProviders locale={lang}>
      <Header />
      {children}
    </ClassicProviders>
  );
}
