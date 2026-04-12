import { Header } from "@/components/ui/Header";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SilhouetteProviders } from "./providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "silhouette" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    alternates: {
      canonical: `https://dragonballdle.site/${lang}/silhouette/`,
      languages: {
        "x-default": `https://dragonballdle.site/${routing.defaultLocale}/silhouette/`,
        ...Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            `https://dragonballdle.site/${locale}/silhouette/`,
          ]),
        ),
      },
    },
  };
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function SilhouetteLayout({
  children,
  params,
}: LayoutProps<"/[lang]/silhouette">) {
  const { lang } = await params;

  return (
    <SilhouetteProviders locale={lang}>
      <style
        dangerouslySetInnerHTML={{
          __html: `body { --bg-image: url("${process.env.NEXT_PUBLIC_CDN_BASE_URL}/background-capsule-corp.png"); }`,
        }}
      />
      <Header />
      {children}
    </SilhouetteProviders>
  );
}
