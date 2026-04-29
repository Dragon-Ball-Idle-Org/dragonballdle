import { Header } from "@/components/ui/Header";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";
import { SilhouetteProviders } from "./providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "silhouette" });

  return buildPageMetadata({
    locale: lang,
    slug: "silhouette",
    title: t("metadata.title"),
    description: t("metadata.description"),
  });
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
